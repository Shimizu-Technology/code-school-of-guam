/**
 * On-demand Pyodide Web Worker for the Code School of Guam hero Python runner.
 * Loaded for a visible, idle first example or when a visitor asks to run/edit.
 * Classic worker (importScripts) for broad desktop, iOS Safari, and Android Chrome support.
 *
 * Security note: Pyodide is pinned to exact release v0.27.5 on jsDelivr because classic
 * worker `importScripts()` does not support Subresource Integrity (SRI) attributes.
 */

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/";
const OUTPUT_LIMIT_CHARS = 8192;
const OUTPUT_LIMIT_LINES = 200;
const OUTPUT_LIMIT_MESSAGE =
  "Output stopped at 200 lines / 8 KB — check your loop, or open in Hafa Code for larger scripts.";

let pyodidePromise = null;

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      self.importScripts(PYODIDE_INDEX_URL + "pyodide.js");
      if (typeof self.loadPyodide !== "function") {
        throw new Error("Python runtime failed to initialize.");
      }
      return self.loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
        packages: [],
      });
    })().catch((err) => {
      pyodidePromise = null;
      throw err;
    });
  }
  return pyodidePromise;
}

function cleanTraceback(message, filename) {
  const lines = String(message || "Python error").split("\n");
  const target = 'File "' + filename + '"';
  const frameRe = /^(\s*)File "([^"]+)", line (\d+)(.*)$/;
  const hasUserFrame = lines.some((l) => l.includes(target));
  if (!hasUserFrame) return lines.join("\n").trim();

  const kept = [];
  let skipping = false;
  let frameIndent = 0;

  for (const line of lines) {
    const match = frameRe.exec(line);
    if (match) {
      frameIndent = match[1].length;
      skipping = match[2] !== filename;
      if (!skipping) kept.push(line);
      continue;
    }
    const indent = line.length - line.trimStart().length;
    if (skipping && line.trim() && indent > frameIndent) continue;
    skipping = false;
    kept.push(line);
  }
  return kept.join("\n").trim();
}

function createOutputCollector(id) {
  let stdout = "";
  let stderr = "";
  let totalChars = 0;
  let totalLines = 0;
  let limited = false;

  const decoderOut = new TextDecoder();
  const decoderErr = new TextDecoder();

  function append(stream, text) {
    if (!text || limited) return;
    let newlines = 0;
    for (let i = text.indexOf("\n"); i !== -1; i = text.indexOf("\n", i + 1)) {
      newlines += 1;
    }
    if (totalChars + text.length > OUTPUT_LIMIT_CHARS || totalLines + newlines > OUTPUT_LIMIT_LINES) {
      const remainingChars = Math.max(0, OUTPUT_LIMIT_CHARS - totalChars);
      let slice = text.slice(0, remainingChars);
      const allowedLines = Math.max(0, OUTPUT_LIMIT_LINES - totalLines);
      if (allowedLines === 0) {
        slice = "";
      } else {
        let idx = -1;
        for (let n = 0; n < allowedLines; n += 1) {
          idx = slice.indexOf("\n", idx + 1);
          if (idx === -1) break;
        }
        if (idx !== -1) slice = slice.slice(0, idx + 1);
      }
      if (stream === "stdout") stdout += slice;
      else stderr += slice;
      limited = true;
      self.postMessage({ id, type: "output_limit", stdout, stderr, message: OUTPUT_LIMIT_MESSAGE });
      return;
    }
    if (stream === "stdout") stdout += text;
    else stderr += text;
    totalChars += text.length;
    totalLines += newlines;
  }

  return {
    append,
    stdoutWriter: {
      isatty: true,
      write(buf) {
        append("stdout", decoderOut.decode(buf, { stream: true }));
        return buf.length;
      },
    },
    stderrWriter: {
      isatty: true,
      write(buf) {
        append("stderr", decoderErr.decode(buf, { stream: true }));
        return buf.length;
      },
    },
    get limited() {
      return limited;
    },
    get stdout() {
      return stdout;
    },
    get stderr() {
      return stderr;
    },
  };
}

self.onmessage = async (event) => {
  const data = event.data || {};
  const { id, type, code, filename = "expense_summary.py" } = data;

  if (type === "warmup") {
    try {
      await getPyodide();
      self.postMessage({ id, type: "ready" });
    } catch (err) {
      self.postMessage({
        id,
        type: "error",
        message: err instanceof Error ? err.message : "Could not load the Python runtime.",
      });
    }
    return;
  }

  if (type !== "run") return;

  try {
    const pyodide = await getPyodide();
    self.postMessage({ id, type: "started" });

    const collector = createOutputCollector(id);
    pyodide.setStdout(collector.stdoutWriter);
    pyodide.setStderr(collector.stderrWriter);
    pyodide.setStdin({ stdin: () => null });

    pyodide.globals.set("__csg_user_code__", String(code || ""));
    pyodide.globals.set("__csg_filename__", String(filename));

    try {
      await pyodide.runPythonAsync(`
import builtins, sys

def __csg_blocked_input(prompt=""):
    raise RuntimeError("input() is not supported in this quick preview. Open in Hafa Code for interactive input.")

__csg_orig_builtins = dict(builtins.__dict__)
__csg_orig_stdout = sys.stdout
__csg_orig_stderr = sys.stderr
builtins.input = __csg_blocked_input
try:
    __csg_ns = {"__name__": "__main__", "__file__": __csg_filename__}
    __csg_compiled = compile(__csg_user_code__, __csg_filename__, "exec")
    exec(__csg_compiled, __csg_ns)
finally:
    builtins.__dict__.clear()
    builtins.__dict__.update(__csg_orig_builtins)
    sys.stdout = __csg_orig_stdout
    sys.stderr = __csg_orig_stderr
    sys.stdout.flush()
    sys.stderr.flush()
`);
      if (!collector.limited) {
        self.postMessage({
          id,
          type: "result",
          stdout: collector.stdout,
          stderr: collector.stderr,
          exitCode: 0,
        });
      }
    } catch (err) {
      try {
        pyodide.runPython("import sys; sys.stdout.flush(); sys.stderr.flush()");
      } catch {
        // Ignore flush failures if the interpreter is already unwinding.
      }
      if (!collector.limited) {
        const cleaned = cleanTraceback(err instanceof Error ? err.message : String(err), filename);
        const prefix = collector.stderr ? "\n" : "";
        // Route exception text through the same 200-line / 8 KB output budget as stdout/stderr.
        // Short tracebacks stay intact; oversized exceptions trigger output_limit cleanly.
        collector.append("stderr", prefix + cleaned);
        if (!collector.limited) {
          self.postMessage({
            id,
            type: "result",
            stdout: collector.stdout,
            stderr: collector.stderr,
            exitCode: 1,
          });
        }
      }
    } finally {
      pyodide.globals.delete("__csg_user_code__");
      pyodide.globals.delete("__csg_filename__");
    }
  } catch (err) {
    self.postMessage({
      id,
      type: "error",
      message: err instanceof Error ? err.message : "Could not start the Python runtime.",
    });
  }
};
