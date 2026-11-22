"use client"

import Link from "next/link"
import { ArrowUpRight, Check, Copy, Pencil, Play, RotateCcw, Square } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from "react"
import { buildHafaCodePythonLink } from "@/lib/hafa-code-link"
import { DEFAULT_PYTHON_CODE, EDITOR_LINES, EDITOR_OUTPUT, HERO_STARTER_KEY, type Token } from "@/lib/python-sample"

export { DEFAULT_PYTHON_CODE, EDITOR_LINES, EDITOR_OUTPUT, HERO_STARTER_KEY }

export const RUN_EXECUTION_TIMEOUT_MS = 5000
export const RUNTIME_SLOW_HINT_MS = 10000
export const RUNTIME_LOAD_SAFETY_TIMEOUT_MS = 90000
export const STOP_GUARD_MS = 400

type RunStatus = "idle" | "loading" | "running" | "done" | "error"

interface WorkerMessage {
  id?: string
  type?: "ready" | "started" | "result" | "output_limit" | "error"
  stdout?: string
  stderr?: string
  exitCode?: number
  message?: string
}

function renderTokenizedLine(line: readonly Token[]) {
  if (!line.length) return " "
  return line.map(([kind, text], ti) =>
    kind ? <span key={ti} className={`home-tok-${kind}`}>{text}</span> : <span key={ti}>{text}</span>
  )
}

function splitLines(text: string): string[] {
  if (!text) return []
  return text.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n")
}

export function HeroEditor() {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE)
  const [isEditing, setIsEditing] = useState(false)
  const [status, setStatus] = useState<RunStatus>("idle")
  const [slowLoadHint, setSlowLoadHint] = useState(false)
  const [stdoutLines, setStdoutLines] = useState<string[]>([...EDITOR_OUTPUT])
  const [stderrText, setStderrText] = useState("")
  const [noticeText, setNoticeText] = useState("")
  const [statusAnnouncement, setStatusAnnouncement] = useState("")
  const [hasExecuted, setHasExecuted] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const workerReadyRef = useRef(false)
  const runIdRef = useRef(0)
  const activeRunIdRef = useRef<string | null>(null)
  const runStartedAtRef = useRef(0)
  const execTimeoutRef = useRef<number | null>(null)
  const loadHintTimeoutRef = useRef<number | null>(null)
  const loadSafetyTimeoutRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const runButtonRef = useRef<HTMLButtonElement>(null)
  const termRef = useRef<HTMLDivElement>(null)

  const isModified = code !== DEFAULT_PYTHON_CODE
  const isBusy = status === "loading" || status === "running"

  const clearTimers = useCallback(() => {
    if (execTimeoutRef.current !== null) {
      window.clearTimeout(execTimeoutRef.current)
      execTimeoutRef.current = null
    }
    if (loadHintTimeoutRef.current !== null) {
      window.clearTimeout(loadHintTimeoutRef.current)
      loadHintTimeoutRef.current = null
    }
    if (loadSafetyTimeoutRef.current !== null) {
      window.clearTimeout(loadSafetyTimeoutRef.current)
      loadSafetyTimeoutRef.current = null
    }
  }, [])

  const terminateWorker = useCallback(() => {
    clearTimers()
    activeRunIdRef.current = null
    setSlowLoadHint(false)
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    workerReadyRef.current = false
  }, [clearTimers])

  useEffect(() => terminateWorker, [terminateWorker])

  // Keep tracebacks and output-cap notices scrolled into view inside the bounded terminal.
  useEffect(() => {
    if (!termRef.current) return
    if (hasExecuted || stderrText || noticeText) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [stdoutLines, stderrText, noticeText, hasExecuted])

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current
    if (typeof Worker === "undefined") {
      throw new Error("This browser does not support Web Workers for in-browser Python.")
    }
    const worker = new Worker("/workers/python-runner.js")
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      if (workerRef.current !== worker) return
      const msg = event.data
      if (!msg) return
      if (msg.type === "ready") {
        workerReadyRef.current = true
        return
      }
      if (!msg.id || msg.id !== activeRunIdRef.current) return

      if (msg.type === "started") {
        workerReadyRef.current = true
        clearTimers()
        setSlowLoadHint(false)
        setStatus("running")
        setStatusAnnouncement("Running expense_summary.py")
        // Start the 5s execution timeout only once Pyodide is loaded and Python starts executing.
        execTimeoutRef.current = window.setTimeout(() => {
          terminateWorker()
          setStatus("error")
          setNoticeText("Stopped after 5 seconds — check for an infinite loop.")
          setStatusAnnouncement("Program stopped after 5 second timeout.")
        }, RUN_EXECUTION_TIMEOUT_MS)
        return
      }

      if (msg.type === "output_limit") {
        terminateWorker()
        setStdoutLines(splitLines(msg.stdout ?? ""))
        setStderrText(msg.stderr ?? "")
        setNoticeText(msg.message ?? "Output limit reached.")
        setStatus("error")
        setHasExecuted(true)
        setStatusAnnouncement("Program stopped because it reached the output limit.")
        return
      }

      if (msg.type === "result") {
        clearTimers()
        activeRunIdRef.current = null
        setSlowLoadHint(false)
        const outLines = splitLines(msg.stdout ?? "")
        const err = (msg.stderr ?? "").trim()
        setStdoutLines(outLines)
        setStderrText(err)
        setNoticeText(outLines.length === 0 && !err ? "(Program finished with no output)" : "")
        setStatus(msg.exitCode === 0 ? "done" : "error")
        setHasExecuted(true)
        setStatusAnnouncement(
          msg.exitCode === 0
            ? `Program finished${outLines.length ? ` with ${outLines.length} lines of output` : " with no output"}.`
            : "Program finished with a Python error.",
        )
        return
      }

      if (msg.type === "error") {
        terminateWorker()
        setStderrText(msg.message ?? "Could not run Python in this browser.")
        setNoticeText("")
        setStatus("error")
        setStatusAnnouncement("Could not run Python in this browser.")
      }
    }

    worker.onerror = () => {
      if (workerRef.current !== worker) return
      terminateWorker()
      setStderrText("Python runtime failed to load. Check your connection or open in Hafa Code.")
      setNoticeText("")
      setStatus("error")
      setStatusAnnouncement("Python runtime failed to load.")
    }

    workerRef.current = worker
    return worker
  }, [clearTimers, terminateWorker])

  const startWarmup = useCallback(() => {
    if (workerRef.current) return
    try {
      const worker = ensureWorker()
      worker.postMessage({ id: "warmup", type: "warmup" })
    } catch {
      // Errors are surfaced cleanly if the user clicks Run.
    }
  }, [ensureWorker])

  const startRun = useCallback(() => {
    clearTimers()
    const runId = `run-${++runIdRef.current}`
    activeRunIdRef.current = runId
    runStartedAtRef.current = Date.now()
    // Clear previous output immediately so timeout/stop notices never sit under stale lines.
    setStdoutLines([])
    setStderrText("")
    setNoticeText("")
    setSlowLoadHint(false)
    const needsLoad = !workerReadyRef.current
    setStatus(needsLoad ? "loading" : "running")
    setStatusAnnouncement(needsLoad ? "Loading Python runtime in your browser…" : "Running expense_summary.py")

    try {
      const worker = ensureWorker()
      if (needsLoad) {
        loadHintTimeoutRef.current = window.setTimeout(() => {
          setSlowLoadHint(true)
          setStatusAnnouncement("Still loading Python (first time only)…")
        }, RUNTIME_SLOW_HINT_MS)
      }
      // Generous safety cap while waiting for runtime load/start; does not interrupt slow mobile downloads early.
      loadSafetyTimeoutRef.current = window.setTimeout(() => {
        terminateWorker()
        setStatus("error")
        setNoticeText("Python took too long to load. Check your connection and try again, or open in Hafa Code.")
        setStatusAnnouncement("Python runtime load timed out.")
      }, RUNTIME_LOAD_SAFETY_TIMEOUT_MS)

      worker.postMessage({ id: runId, type: "run", code, filename: "expense_summary.py" })
    } catch (err) {
      terminateWorker()
      setStderrText(err instanceof Error ? err.message : "Could not start Python.")
      setStatus("error")
      setStatusAnnouncement("Could not start Python.")
    }
  }, [clearTimers, code, ensureWorker, terminateWorker])

  const handleRunClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.detail > 1) return
      startRun()
    },
    [startRun],
  )

  const handleStopClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      // Guard against a double-click/double-tap on Run accidentally hitting the swapped Stop button.
      if (event.detail > 1) return
      if (Date.now() - runStartedAtRef.current < STOP_GUARD_MS) return
      terminateWorker()
      setStatus("idle")
      setNoticeText("Stopped.")
      setStatusAnnouncement("Execution stopped.")
    },
    [terminateWorker],
  )

  const handleEnterEdit = useCallback(() => {
    setIsEditing(true)
    startWarmup()
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }, [startWarmup])

  const handleReset = useCallback(() => {
    // Always terminate the worker on Reset so any mutated Python globals/builtins start fresh.
    terminateWorker()
    setCode(DEFAULT_PYTHON_CODE)
    setStdoutLines([...EDITOR_OUTPUT])
    setStderrText("")
    setNoticeText("")
    setStatus("idle")
    setHasExecuted(false)
    setStatusAnnouncement("Reset to the default expense_summary.py example.")
    requestAnimationFrame(() => {
      if (isEditing && textareaRef.current) {
        textareaRef.current.focus()
      } else {
        runButtonRef.current?.focus()
      }
    })
  }, [isEditing, terminateWorker])

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      if (!isBusy) startRun()
    }
  }

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(code)
      setCopiedCode(true)
      setStatusAnnouncement("Python code copied to clipboard.")
      window.setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      setStatusAnnouncement("Could not copy automatically. Select the code in the editor to copy it.")
    }
  }, [code])

  const handleEditorScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  const hafaCodeLink = useMemo(
    () =>
      buildHafaCodePythonLink(code, {
        title: "Expense summary",
        filename: "expense_summary.py",
        starterKey: HERO_STARTER_KEY,
      }),
    [code],
  )

  const lineCount = useMemo(() => Math.max(EDITOR_LINES.length, code.split("\n").length), [code])

  return (
    <figure className="home-editor" aria-labelledby="home-editor-caption">
      <div className="home-editor-top">
        <div className="home-editor-tabs" aria-hidden="true">
          <i /><i /><i />
          <span>expense_summary.py</span>
        </div>
        <div className="home-editor-actions">
          {!isEditing ? (
            <button
              type="button"
              className="home-ed-btn"
              onClick={handleEnterEdit}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Write your own
            </button>
          ) : null}
          {isModified || hasExecuted ? (
            <button
              type="button"
              className="home-ed-btn"
              onClick={handleReset}
              aria-label="Reset to default Python example"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          ) : null}
          {isBusy ? (
            <button
              type="button"
              className="home-run home-run-stop"
              onClick={handleStopClick}
              aria-label="Stop running Python"
            >
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
              Stop
            </button>
          ) : (
            <button
              ref={runButtonRef}
              type="button"
              className="home-run"
              onClick={handleRunClick}
              aria-label={isEditing ? "Run your Python code" : "Run the Python example in your browser"}
            >
              <Play className="h-3 w-3 fill-current" aria-hidden="true" />
              Run
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="home-code-edit-wrap">
          <div ref={gutterRef} className="home-code-gutter" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleEditorKeyDown}
            onScroll={handleEditorScroll}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
            aria-label="Python code editor for expense_summary.py"
            aria-describedby="home-editor-hint"
            className="home-code-input"
          />
          <p id="home-editor-hint" className="sr-only">
            Edit the Python code, then press Run or Control plus Enter to execute it in your browser. Press Tab to move to the next button.
          </p>
        </div>
      ) : (
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable code region must be keyboard focusable */
        <div role="region" aria-label="Sample Python code: expense_summary.py" tabIndex={0} className="home-code-region">
          <pre className="home-code">
            {EDITOR_LINES.map((line, li) => (
              <span key={li} className="home-ln">
                {renderTokenizedLine(line)}
              </span>
            ))}
          </pre>
        </div>
      )}

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable output region must be keyboard focusable */}
      <div ref={termRef} className="home-term" role="region" aria-label="Python program output" tabIndex={0}>
        <div className="home-term-bar">
          <span className="home-term-line">
            <span className="home-term-prompt">$</span> python expense_summary.py
          </span>
          {status === "loading" ? (
            <span className="home-term-status">
              {slowLoadHint ? "Still loading Python (first time only)…" : "Loading Python…"}
            </span>
          ) : null}
          {status === "running" ? <span className="home-term-status">Running…</span> : null}
          {status === "done" && hasExecuted ? <span className="home-term-status home-term-status-ok">Ran in browser</span> : null}
        </div>
        {stdoutLines.map((line, i) => (
          <span
            key={`${i}-${line}`}
            className={
              !stderrText && !noticeText && i === stdoutLines.length - 1 && line.startsWith("Under budget")
                ? "home-term-line home-term-ok"
                : "home-term-line"
            }
          >
            {line}
          </span>
        ))}
        {stderrText ? <pre className="home-term-err">{stderrText}</pre> : null}
        {noticeText ? <span className="home-term-line home-term-note">{noticeText}</span> : null}
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {statusAnnouncement}
      </p>

      <figcaption id="home-editor-caption" className="sr-only">
        Interactive Python editor with expense_summary.py: sums three expenses, prints each category, and shows the remaining budget. Click Run to execute real Python in your browser, or Write your own to edit the code.
      </figcaption>

      <div className="home-editor-foot">
        <Link href="/courses/python-fundamentals" className="home-pill home-pill-link">
          Python Fundamentals
        </Link>
        <span className="home-pill">Runs in your browser</span>
        <a
          href={hafaCodeLink.url}
          target="_blank"
          rel="noopener noreferrer"
          className="home-pill-ext"
        >
          Open in Hafa Code <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
      {hafaCodeLink.truncated ? (
        <div className="home-editor-oversize" role="note">
          <span>Code is too large to preload in a link — copy it, then paste in Hafa Code.</span>
          <button type="button" className="home-ed-btn home-ed-btn-sm" onClick={handleCopyCode}>
            {copiedCode ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copiedCode ? "Copied" : "Copy code"}
          </button>
        </div>
      ) : null}
    </figure>
  )
}
