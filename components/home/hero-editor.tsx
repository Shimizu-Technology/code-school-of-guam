"use client"

import Link from "next/link"
import { ArrowUpRight, Pencil, Play, RotateCcw, Square } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { buildHafaCodePythonUrl } from "@/lib/hafa-code-link"

type Token = readonly [kind: "" | "k" | "s" | "n" | "f", text: string]

// A plain beginner program: a dictionary, sum(), a for loop, and an if.
// Every line is short enough to fit a 390px phone without scrolling.
export const EDITOR_LINES: readonly (readonly Token[])[] = [
  [["", "expenses = {"]],
  [["", "    "], ["s", '"Food"'], ["", ": "], ["n", "61"], ["", ","]],
  [["", "    "], ["s", '"Transport"'], ["", ": "], ["n", "48"], ["", ","]],
  [["", "    "], ["s", '"Supplies"'], ["", ": "], ["n", "9"], ["", ","]],
  [["", "}"]],
  [["", "budget = "], ["n", "120"]],
  [],
  [["", "total = "], ["f", "sum"], ["", "(expenses."], ["f", "values"], ["", "())"]],
  [["f", "print"], ["", "("], ["s", 'f"Total: ${total}"'], ["", ")"]],
  [],
  [["k", "for"], ["", " item, cost "], ["k", "in"], ["", " expenses."], ["f", "items"], ["", "():"]],
  [["", "    "], ["f", "print"], ["", "("], ["s", 'f"{item}: ${cost}"'], ["", ")"]],
  [],
  [["", "left = budget - total"]],
  [["k", "if"], ["", " left >= "], ["n", "0"], ["", ":"]],
  [["", "    "], ["f", "print"], ["", "("], ["s", 'f"Under budget by ${left}"'], ["", ")"]],
]

export const DEFAULT_PYTHON_CODE = EDITOR_LINES.map((line) =>
  line.map(([, text]) => text).join("")
).join("\n")

export const EDITOR_OUTPUT = [
  "Total: $118",
  "Food: $61",
  "Transport: $48",
  "Supplies: $9",
  "Under budget by $2",
] as const

export const RUN_EXECUTION_TIMEOUT_MS = 5000
export const RUNTIME_STARTUP_TIMEOUT_MS = 25000

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
  const [stdoutLines, setStdoutLines] = useState<string[]>([...EDITOR_OUTPUT])
  const [stderrText, setStderrText] = useState("")
  const [noticeText, setNoticeText] = useState("")
  const [statusAnnouncement, setStatusAnnouncement] = useState("")
  const [hasExecuted, setHasExecuted] = useState(false)

  const workerRef = useRef<Worker | null>(null)
  const workerReadyRef = useRef(false)
  const runIdRef = useRef(0)
  const activeRunIdRef = useRef<string | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isModified = code !== DEFAULT_PYTHON_CODE
  const isBusy = status === "loading" || status === "running"

  const clearTimer = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const terminateWorker = useCallback(() => {
    clearTimer()
    activeRunIdRef.current = null
    if (workerRef.current) {
      workerRef.current.terminate()
      workerRef.current = null
    }
    workerReadyRef.current = false
  }, [clearTimer])

  useEffect(() => terminateWorker, [terminateWorker])

  const ensureWorker = useCallback(() => {
    if (workerRef.current) return workerRef.current
    if (typeof Worker === "undefined") {
      throw new Error("This browser does not support Web Workers for in-browser Python.")
    }
    const worker = new Worker("/workers/python-runner.js")
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const msg = event.data
      if (!msg) return
      if (msg.type === "ready") {
        workerReadyRef.current = true
        return
      }
      if (!msg.id || msg.id !== activeRunIdRef.current) return

      if (msg.type === "started") {
        workerReadyRef.current = true
        setStatus("running")
        setStatusAnnouncement("Running expense_summary.py")
        clearTimer()
        timeoutRef.current = window.setTimeout(() => {
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
        clearTimer()
        activeRunIdRef.current = null
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
      terminateWorker()
      setStderrText("Python runtime failed to load. Check your connection or open in Hafa Code.")
      setNoticeText("")
      setStatus("error")
      setStatusAnnouncement("Python runtime failed to load.")
    }

    workerRef.current = worker
    return worker
  }, [clearTimer, terminateWorker])

  const startWarmup = useCallback(() => {
    if (workerRef.current) return
    try {
      const worker = ensureWorker()
      worker.postMessage({ id: "warmup", type: "warmup" })
    } catch {
      // Errors are surfaced cleanly if the user clicks Run.
    }
  }, [ensureWorker])

  const handleRun = useCallback(() => {
    clearTimer()
    const runId = `run-${++runIdRef.current}`
    activeRunIdRef.current = runId
    setStderrText("")
    setNoticeText("")
    const needsLoad = !workerReadyRef.current
    setStatus(needsLoad ? "loading" : "running")
    setStatusAnnouncement(needsLoad ? "Loading Python runtime in your browser…" : "Running expense_summary.py")

    try {
      const worker = ensureWorker()
      timeoutRef.current = window.setTimeout(() => {
        terminateWorker()
        setStatus("error")
        setNoticeText(
          needsLoad
            ? "Python took too long to load. Check your connection and try again, or open in Hafa Code."
            : "Stopped after 5 seconds — check for an infinite loop.",
        )
        setStatusAnnouncement("Program stopped after timeout.")
      }, needsLoad ? RUNTIME_STARTUP_TIMEOUT_MS : RUN_EXECUTION_TIMEOUT_MS)

      worker.postMessage({ id: runId, type: "run", code, filename: "expense_summary.py" })
    } catch (err) {
      terminateWorker()
      setStderrText(err instanceof Error ? err.message : "Could not start Python.")
      setStatus("error")
      setStatusAnnouncement("Could not start Python.")
    }
  }, [clearTimer, code, ensureWorker, terminateWorker])

  const handleStop = useCallback(() => {
    terminateWorker()
    setStatus("idle")
    setNoticeText("Stopped.")
    setStatusAnnouncement("Execution stopped.")
  }, [terminateWorker])

  const handleEnterEdit = useCallback(() => {
    setIsEditing(true)
    startWarmup()
    requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })
  }, [startWarmup])

  const handleReset = useCallback(() => {
    if (isBusy) terminateWorker()
    setCode(DEFAULT_PYTHON_CODE)
    setStdoutLines([...EDITOR_OUTPUT])
    setStderrText("")
    setNoticeText("")
    setStatus("idle")
    setHasExecuted(false)
    setStatusAnnouncement("Reset to the default expense_summary.py example.")
  }, [isBusy, terminateWorker])

  const handleEditorKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault()
      if (!isBusy) handleRun()
    }
  }

  const hafaCodeUrl = useMemo(
    () => buildHafaCodePythonUrl(code, { title: "Expense summary", filename: "expense_summary.py" }),
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
              onClick={handleStop}
              aria-label="Stop running Python"
            >
              <Square className="h-3 w-3 fill-current" aria-hidden="true" />
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="home-run"
              onClick={handleRun}
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
          <div className="home-code-gutter" aria-hidden="true">
            {Array.from({ length: lineCount }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            onKeyDown={handleEditorKeyDown}
            rows={Math.min(22, Math.max(16, lineCount))}
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
        <pre className="home-code" aria-label="Sample Python code: expense_summary.py">
          {EDITOR_LINES.map((line, li) => (
            <span key={li} className="home-ln">
              {renderTokenizedLine(line)}
            </span>
          ))}
        </pre>
      )}

      <div className="home-term" role="region" aria-label="Python program output">
        <div className="home-term-bar">
          <span className="home-term-line">
            <span className="home-term-prompt">$</span> python expense_summary.py
          </span>
          {status === "loading" ? <span className="home-term-status">Loading Python…</span> : null}
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
          href={hafaCodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="home-pill-ext"
        >
          Open in Hafa Code <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </figure>
  )
}
