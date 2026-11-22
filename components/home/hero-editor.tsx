"use client"

import Link from "next/link"
import { ArrowUpRight, Check, Copy, Pencil, Play, RotateCcw, Square } from "lucide-react"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { buildHafaCodePythonLink } from "@/lib/hafa-code-link"
import { DEFAULT_PYTHON_CODE, EDITOR_LINES, EDITOR_OUTPUT, HERO_FILENAME, HERO_STARTER_KEY } from "@/lib/python-sample"
// Type-only import: erased at build time, so CodeMirror stays out of first-load JS.
import type { AccessoryKey, PythonEditorHandle } from "./python-editor"

export { DEFAULT_PYTHON_CODE, EDITOR_LINES, EDITOR_OUTPUT, HERO_STARTER_KEY }

export const RUN_EXECUTION_TIMEOUT_MS = 5000
export const RUNTIME_SLOW_HINT_MS = 10000
export const RUNTIME_LOAD_SAFETY_TIMEOUT_MS = 90000
export const STOP_GUARD_MS = 400
export const EDITOR_LOADING_HINT_DELAY_MS = 400
/** A visual viewport this much shorter than the window means the on-screen keyboard is open. */
const KEYBOARD_OPEN_THRESHOLD_PX = 120

type RunStatus = "idle" | "loading" | "running" | "done" | "error"
type EditorMode = "static" | "loading" | "ready" | "failed"

interface WorkerMessage {
  id?: string
  type?: "ready" | "started" | "result" | "output_limit" | "error"
  stdout?: string
  stderr?: string
  exitCode?: number
  message?: string
}

const CODING_KEYS: ReadonlyArray<{ key: AccessoryKey; label: string; glyph: string; wide?: boolean }> = [
  { key: "tab", label: "Indent (Tab)", glyph: "⇥", wide: true },
  { key: "colon", label: "Insert colon", glyph: ":" },
  { key: "parens", label: "Insert parentheses", glyph: "( )", wide: true },
  { key: "quotes", label: "Insert quotes", glyph: '" "', wide: true },
  { key: "equals", label: "Insert equals sign", glyph: "=" },
  { key: "undo", label: "Undo", glyph: "↶" },
  { key: "brackets", label: "Insert square brackets", glyph: "[ ]", wide: true },
  { key: "braces", label: "Insert curly braces", glyph: "{ }", wide: true },
  { key: "hash", label: "Insert hash (comment)", glyph: "#" },
  { key: "left", label: "Move cursor left", glyph: "←" },
  { key: "right", label: "Move cursor right", glyph: "→" },
]

function splitLines(text: string): string[] {
  if (!text) return []
  return text.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n")
}

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {}
    const list = window.matchMedia(query)
    list.addEventListener?.("change", callback)
    return () => list.removeEventListener?.("change", callback)
  }
}

const COARSE_QUERY = "(pointer: coarse)"
const subscribeCoarse = subscribeMedia(COARSE_QUERY)
const getCoarse = () => typeof window !== "undefined" && !!window.matchMedia?.(COARSE_QUERY).matches
const getServerCoarse = () => false

function prefersReducedMotion() {
  return typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
}

function keyboardOpen() {
  const vv = typeof window !== "undefined" ? window.visualViewport : null
  return !!vv && window.innerHeight - vv.height > KEYBOARD_OPEN_THRESHOLD_PX
}

/** The part of the sticky site header still visible above the visual viewport. */
function visibleHeaderHeight() {
  const header = document.querySelector("header")
  if (!header) return 0
  const offset = window.visualViewport?.offsetTop ?? 0
  return Math.max(0, header.getBoundingClientRect().bottom - offset)
}

interface CodingKeysProps {
  busy: boolean
  onKey: (key: AccessoryKey) => void
  onRun: () => void
  onStop: () => void
  onLayout: (height: number, keyboardIsOpen: boolean, visibleHeight: number) => void
}

/** A tap that moved more than this is a swipe along the key strip, not a key press. */
const TAP_SLOP_PX = 10

/**
 * Press handling for the coding keys. pointerdown is cancelled so the editor keeps
 * focus (and the keyboard stays up); the action runs on pointerup because WebKit may
 * skip the click after a cancelled pointerdown. A swipe (or the browser taking over
 * the scroll) cancels the press. Clicks without a pointer press (keyboard, VoiceOver)
 * still work.
 */
function usePress() {
  const startRef = useRef<{ id: number; x: number; y: number; target: HTMLButtonElement } | null>(null)
  const pressedAtRef = useRef(0)
  return useCallback(
    (action: () => void) => ({
      onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
        event.preventDefault()
        startRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, target: event.currentTarget }
      },
      onPointerUp: (event: PointerEvent<HTMLButtonElement>) => {
        const start = startRef.current
        startRef.current = null
        pressedAtRef.current = Date.now()
        if (!start || start.id !== event.pointerId || start.target !== event.currentTarget) return
        if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP_PX) return
        action()
      },
      onPointerCancel: () => {
        startRef.current = null
      },
      onMouseDown: (event: MouseEvent<HTMLButtonElement>) => event.preventDefault(),
      onClick: () => {
        if (Date.now() - pressedAtRef.current < 600) return
        action()
      },
    }),
    [],
  )
}

/**
 * Coding keys pinned to the bottom of the *visual* viewport, so they ride on top of
 * the on-screen keyboard (iOS keeps fixed elements on the layout viewport, which the
 * keyboard covers). Buttons never take focus, so the keyboard stays open.
 */
function CodingKeys({ busy, onKey, onRun, onStop, onLayout }: CodingKeysProps) {
  const barRef = useRef<HTMLDivElement>(null)

  // Layout effect: place the bar before the first paint so it never flashes at the top.
  useLayoutEffect(() => {
    const bar = barRef.current
    if (!bar) return
    document.body.dataset.codingKeys = "open"
    const vv = window.visualViewport
    let frame = 0
    const place = () => {
      frame = 0
      const height = vv ? vv.height : window.innerHeight
      const top = vv ? vv.offsetTop : 0
      const left = vv ? vv.offsetLeft : 0
      const width = vv ? vv.width : window.innerWidth
      const open = keyboardOpen()
      bar.dataset.keyboard = open ? "open" : "closed"
      bar.style.width = `${width}px`
      bar.style.transform = `translate3d(${left}px, ${top + height - bar.offsetHeight}px, 0)`
      onLayout(bar.offsetHeight, open, height)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place)
    }
    place()
    vv?.addEventListener("resize", schedule)
    vv?.addEventListener("scroll", schedule)
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", schedule, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      vv?.removeEventListener("resize", schedule)
      vv?.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", schedule)
      delete document.body.dataset.codingKeys
      onLayout(0, false, window.innerHeight)
    }
  }, [onLayout])

  const press = usePress()

  return (
    <div ref={barRef} className="home-keys" role="toolbar" aria-label="Coding keys" data-keyboard="closed">
      <div className="home-keys-scroll">
        {CODING_KEYS.map(({ key, label, glyph, wide }) => (
          <button
            key={key}
            type="button"
            className={wide ? "home-key home-key-wide" : "home-key"}
            aria-label={label}
            {...press(() => onKey(key))}
          >
            {glyph}
          </button>
        ))}
      </div>
      {busy ? (
        <button
          type="button"
          className="home-key-run home-key-stop"
          aria-label="Stop running Python"
          {...press(onStop)}
        >
          <Square className="h-3 w-3 fill-current" aria-hidden="true" />
          Stop
        </button>
      ) : (
        <button
          type="button"
          className="home-key-run"
          aria-label="Run your Python code"
          {...press(onRun)}
        >
          <Play className="h-3 w-3 fill-current" aria-hidden="true" />
          Run
        </button>
      )}
    </div>
  )
}

export function HeroEditor({ staticCode }: { staticCode: ReactNode }) {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE)
  const [editorMode, setEditorMode] = useState<EditorMode>("static")
  const [editorFocused, setEditorFocused] = useState(false)
  const [showEditorLoading, setShowEditorLoading] = useState(false)
  const [keyboardIsOpen, setKeyboardIsOpen] = useState(false)
  const [modifierLabel, setModifierLabel] = useState("Ctrl")
  const [status, setStatus] = useState<RunStatus>("idle")
  const [slowLoadHint, setSlowLoadHint] = useState(false)
  const [stdoutLines, setStdoutLines] = useState<string[]>([...EDITOR_OUTPUT])
  const [stderrText, setStderrText] = useState("")
  const [noticeText, setNoticeText] = useState("")
  const [statusAnnouncement, setStatusAnnouncement] = useState("")
  const [hasExecuted, setHasExecuted] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const isCoarse = useSyncExternalStore(subscribeCoarse, getCoarse, getServerCoarse)

  const workerRef = useRef<Worker | null>(null)
  const workerReadyRef = useRef(false)
  const runIdRef = useRef(0)
  const activeRunIdRef = useRef<string | null>(null)
  const runStartedAtRef = useRef(0)
  const execTimeoutRef = useRef<number | null>(null)
  const loadHintTimeoutRef = useRef<number | null>(null)
  const loadSafetyTimeoutRef = useRef<number | null>(null)
  const runButtonRef = useRef<HTMLButtonElement>(null)
  const termRef = useRef<HTMLDivElement>(null)
  const figureRef = useRef<HTMLElement>(null)
  const codeAreaRef = useRef<HTMLDivElement>(null)
  const staticRef = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const proxyRef = useRef<HTMLTextAreaElement | null>(null)
  const editorRef = useRef<PythonEditorHandle | null>(null)
  const editorLoadingRef = useRef(false)
  const pendingInputRef = useRef("")
  const keyboardWasOpenRef = useRef(false)
  const codeRef = useRef(DEFAULT_PYTHON_CODE)
  const keysHeightRef = useRef(0)
  const blurTimerRef = useRef<number | null>(null)
  const runFromEditorRef = useRef<() => void>(() => {})
  const focusOnReadyRef = useRef(false)

  const isEditing = editorMode === "loading" || editorMode === "ready"
  const isModified = code !== DEFAULT_PYTHON_CODE
  const isBusy = status === "loading" || status === "running"

  const updateCode = useCallback((next: string) => {
    codeRef.current = next
    setCode(next)
  }, [])

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

  useEffect(
    () => () => {
      editorRef.current?.destroy()
      editorRef.current = null
      proxyRef.current?.remove()
      if (blurTimerRef.current !== null) window.clearTimeout(blurTimerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!isEditing) return
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ?? navigator.platform ?? ""
    setModifierLabel(/mac|iphone|ipad/i.test(platform) ? "⌘" : "Ctrl")
  }, [isEditing])

  // Keep tracebacks and output-cap notices scrolled into view inside the bounded terminal.
  useEffect(() => {
    if (!termRef.current) return
    if (hasExecuted || stderrText || noticeText) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [stdoutLines, stderrText, noticeText, hasExecuted])

  // A short "Loading editor…" note only if the chunk takes a noticeable moment.
  useEffect(() => {
    if (editorMode !== "loading") {
      setShowEditorLoading(false)
      return
    }
    const timer = window.setTimeout(() => setShowEditorLoading(true), EDITOR_LOADING_HINT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [editorMode])

  /** Brings the output into view (scrolling only as far as needed). */
  const revealOutput = useCallback(() => {
    const term = termRef.current
    if (!term || typeof term.scrollIntoView !== "function") return
    term.scrollIntoView({ block: "nearest", behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }, [])

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
        setStatusAnnouncement(`Running ${HERO_FILENAME}`)
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
    setStatusAnnouncement(needsLoad ? "Loading Python runtime in your browser…" : `Running ${HERO_FILENAME}`)

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

      worker.postMessage({ id: runId, type: "run", code: codeRef.current, filename: HERO_FILENAME })
    } catch (err) {
      terminateWorker()
      setStderrText(err instanceof Error ? err.message : "Could not start Python.")
      setStatus("error")
      setStatusAnnouncement("Could not start Python.")
    }
  }, [clearTimers, ensureWorker, terminateWorker])

  const handleRunClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.detail > 1) return
      startRun()
      revealOutput()
    },
    [revealOutput, startRun],
  )

  const stopRun = useCallback(() => {
    // Guard against a double-tap on Run accidentally hitting the swapped Stop button.
    if (Date.now() - runStartedAtRef.current < STOP_GUARD_MS) return
    terminateWorker()
    setStatus("idle")
    setNoticeText("Stopped.")
    setStatusAnnouncement("Execution stopped.")
  }, [terminateWorker])

  const handleStopClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (event.detail > 1) return
      stopRun()
    },
    [stopRun],
  )

  // Cmd/Ctrl+Enter inside the editor: run and keep typing.
  useEffect(() => {
    runFromEditorRef.current = () => {
      if (activeRunIdRef.current) return
      startRun()
      revealOutput()
    }
  }, [revealOutput, startRun])

  /** Run from the coding keys: close the keyboard first, then show the output. */
  const handleKeysRun = useCallback(() => {
    if (activeRunIdRef.current) return
    const wasOpen = keyboardOpen()
    editorRef.current?.blur()
    startRun()
    const vv = window.visualViewport
    if (!wasOpen || !vv) {
      revealOutput()
      return
    }
    let fallback = 0
    const done = () => {
      vv.removeEventListener("resize", onResize)
      window.clearTimeout(fallback)
      revealOutput()
    }
    const onResize = () => {
      if (!keyboardOpen()) done()
    }
    vv.addEventListener("resize", onResize)
    fallback = window.setTimeout(done, 700)
  }, [revealOutput, startRun])

  const handleKey = useCallback((key: AccessoryKey) => {
    const editor = editorRef.current
    if (!editor) return
    editor.runKey(key)
    editor.focus()
  }, [])

  const handleKeysLayout = useCallback((height: number, open: boolean, visibleHeight: number) => {
    keysHeightRef.current = height
    setKeyboardIsOpen(open)
    if (!height) keyboardWasOpenRef.current = false
    const figure = figureRef.current
    if (!figure) return
    if (open) {
      // Fit the code between the visible header and the coding keys while typing.
      const areaTop = (codeAreaRef.current?.getBoundingClientRect().top ?? 0) - (window.visualViewport?.offsetTop ?? 0)
      const room = Math.min(
        visibleHeight - visibleHeaderHeight() - height - 8,
        visibleHeight - Math.max(0, areaTop) - height - 8,
      )
      figure.style.setProperty("--code-kb-max-h", `${Math.max(48, Math.round(room))}px`)
    } else {
      figure.style.removeProperty("--code-kb-max-h")
    }
  }, [])

  // When the keyboard opens, line the code up under the header so the whole (shrunk) editor
  // sits between the header and the coding keys; then keep the cursor in view.
  useEffect(() => {
    if (editorMode !== "ready" || !editorFocused) return
    if (keyboardIsOpen && !keyboardWasOpenRef.current) {
      const area = codeAreaRef.current
      const vv = window.visualViewport
      if (area && vv) {
        const offset = area.getBoundingClientRect().top - vv.offsetTop - (visibleHeaderHeight() + 8)
        if (Math.abs(offset) > 4) window.scrollBy({ top: offset, behavior: "auto" })
        handleKeysLayout(keysHeightRef.current, true, vv.height)
      }
    }
    keyboardWasOpenRef.current = keyboardIsOpen
    editorRef.current?.revealCursor()
  }, [keyboardIsOpen, editorMode, editorFocused, handleKeysLayout])

  const removeProxy = useCallback(() => {
    const proxy = proxyRef.current
    proxyRef.current = null
    if (!proxy) return ""
    const typed = proxy.value
    proxy.remove()
    return typed
  }, [])

  /**
   * iOS only raises the keyboard for focus() inside the tap itself, and the editor
   * arrives a moment later. Hold the keyboard open with an invisible textarea at the
   * tap point; CodeMirror takes focus (and anything typed meanwhile) when it mounts.
   */
  const holdKeyboard = useCallback((offsetY: number) => {
    const area = codeAreaRef.current
    if (!area || proxyRef.current) return
    const proxy = document.createElement("textarea")
    proxy.className = "home-focus-proxy"
    proxy.setAttribute("aria-hidden", "true")
    proxy.setAttribute("autocapitalize", "off")
    proxy.setAttribute("autocorrect", "off")
    proxy.setAttribute("autocomplete", "off")
    proxy.spellcheck = false
    proxy.tabIndex = -1
    proxy.style.top = `${Math.max(0, offsetY)}px`
    area.appendChild(proxy)
    proxyRef.current = proxy
    proxy.focus({ preventScroll: true })
  }, [])

  const loadEditor = useCallback(
    (tap?: { clientX: number; clientY: number }) => {
      if (editorRef.current) {
        editorRef.current.focus()
        return
      }
      if (editorLoadingRef.current) return
      editorLoadingRef.current = true

      const area = codeAreaRef.current
      const staticScroller = staticRef.current
      const areaRect = area?.getBoundingClientRect()
      // Remember the tap relative to the code (the page may scroll while the keyboard opens).
      const tapOffset =
        tap && areaRect ? { x: tap.clientX - areaRect.left, y: tap.clientY - areaRect.top } : null
      const scrollTop = staticScroller?.scrollTop ?? 0
      if (getCoarse()) holdKeyboard(tapOffset?.y ?? 24)

      setEditorMode("loading")
      startWarmup()

      import("./python-editor")
        .then((mod) => {
          const parent = mountRef.current
          if (!parent) throw new Error("Editor container is missing.")
          const editor = mod.createPythonEditor({
            parent,
            doc: codeRef.current,
            ariaLabel: `Python code editor for ${HERO_FILENAME}`,
            describedBy: "home-editor-hint",
            onChange: (next) => {
              codeRef.current = next
              setCode(next)
            },
            onRun: () => runFromEditorRef.current(),
            onFocusChange: (focused) => {
              if (blurTimerRef.current !== null) {
                window.clearTimeout(blurTimerRef.current)
                blurTimerRef.current = null
              }
              if (focused) setEditorFocused(true)
              // Tapping a coding key can blur for a frame; don't flash the bar away.
              else blurTimerRef.current = window.setTimeout(() => setEditorFocused(false), 150)
            },
            scrollMargins: () => ({
              top: visibleHeaderHeight() + 8,
              bottom: (keysHeightRef.current || 0) + 8,
            }),
          })
          editorRef.current = editor
          editor.view.scrollDOM.scrollTop = scrollTop
          const newRect = parent.getBoundingClientRect()
          if (tapOffset) editor.placeCursorAt(newRect.left + tapOffset.x, newRect.top + tapOffset.y)
          else editor.placeCursorAtEnd()
          focusOnReadyRef.current = true
          setEditorMode("ready")
        })
        .catch(() => {
          editorLoadingRef.current = false
          pendingInputRef.current += removeProxy()
          setEditorMode("failed")
          setStatusAnnouncement("The code editor did not load. Check your connection and try again.")
        })
    },
    [holdKeyboard, removeProxy, startWarmup],
  )

  // Focus once the editor is visible (an invisible element cannot take focus).
  useLayoutEffect(() => {
    if (editorMode !== "ready" || !focusOnReadyRef.current) return
    focusOnReadyRef.current = false
    const editor = editorRef.current
    if (!editor) return
    // Transfer focus directly from the still-mounted iOS holder, with no body-focus gap.
    editor.focus()
    const typed = pendingInputRef.current + (proxyRef.current?.value ?? "")
    editor.insertAtCursor(typed)
    pendingInputRef.current = ""
    removeProxy()
    editor.revealCursor()
  }, [editorMode, removeProxy])

  const handleEnterEdit = useCallback(() => loadEditor(), [loadEditor])

  const handleStaticClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      // Let visitors select and copy the sample without switching modes.
      const selection = window.getSelection?.()
      if (selection && !selection.isCollapsed) return
      loadEditor({ clientX: event.clientX, clientY: event.clientY })
    },
    [loadEditor],
  )

  const handleReset = useCallback(() => {
    // Always terminate the worker on Reset so any mutated Python globals/builtins start fresh.
    terminateWorker()
    pendingInputRef.current = ""
    if (proxyRef.current) proxyRef.current.value = ""
    updateCode(DEFAULT_PYTHON_CODE)
    // An undoable replace, so Undo brings the visitor's own code back.
    editorRef.current?.setDoc(DEFAULT_PYTHON_CODE)
    setStdoutLines([...EDITOR_OUTPUT])
    setStderrText("")
    setNoticeText("")
    setStatus("idle")
    setHasExecuted(false)
    setStatusAnnouncement(`Reset to the default ${HERO_FILENAME} example.`)
    requestAnimationFrame(() => {
      if (editorRef.current) {
        editorRef.current.focus()
      } else {
        runButtonRef.current?.focus()
      }
    })
  }, [terminateWorker, updateCode])

  const handleCopyCode = useCallback(async () => {
    try {
      await navigator.clipboard?.writeText(codeRef.current)
      setCopiedCode(true)
      setStatusAnnouncement("Python code copied to clipboard.")
      window.setTimeout(() => setCopiedCode(false), 2000)
    } catch {
      setStatusAnnouncement("Could not copy automatically. Select the code in the editor to copy it.")
    }
  }, [])

  const hafaCodeLink = useMemo(
    () =>
      buildHafaCodePythonLink(code, {
        title: "Expense summary",
        filename: HERO_FILENAME,
        starterKey: HERO_STARTER_KEY,
      }),
    [code],
  )

  const showKeys = editorMode === "ready" && editorFocused && isCoarse

  return (
    <figure
      ref={figureRef}
      className="home-editor"
      aria-labelledby="home-editor-caption"
      data-editing={isEditing ? "" : undefined}
      data-keyboard={showKeys && keyboardIsOpen ? "open" : undefined}
    >
      <div className="home-editor-top">
        <div className="home-editor-tabs" aria-hidden="true">
          <i />
          <i />
          <i />
          <span className="home-editor-file">
            {HERO_FILENAME}
            {isModified ? <b className="home-editor-dirty" /> : null}
          </span>
        </div>
        <div className="home-editor-actions">
          {!isEditing ? (
            <button type="button" className="home-ed-btn" onClick={handleEnterEdit}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Write your own
            </button>
          ) : null}
          {isModified || hasExecuted || editorMode === "loading" || editorMode === "failed" ? (
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

      <div ref={codeAreaRef} className="home-code-area" data-mode={editorMode}>
        {editorMode !== "ready" ? (
          /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Tapping the code is a pointer shortcut; keyboard users press "Write your own". The region is focusable so it can scroll. */
          <div
            ref={staticRef}
            role="region"
            aria-label={`Sample Python code: ${HERO_FILENAME}`}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable code region must be keyboard focusable
            tabIndex={0}
            className="home-code-scroller"
            onClick={handleStaticClick}
          >
            {staticCode}
          </div>
        ) : null}
        <div ref={mountRef} className="home-cm-mount" />
        {showEditorLoading ? (
          <p className="home-code-note" role="status">
            <span className="home-code-spinner" aria-hidden="true" /> Loading editor…
          </p>
        ) : null}
        {editorMode === "failed" ? (
          <p className="home-code-note home-code-note-error" role="alert">
            The editor didn’t load.
            <button type="button" className="home-ed-btn home-ed-btn-sm" onClick={handleEnterEdit}>
              Try again
            </button>
          </p>
        ) : null}
        <p id="home-editor-hint" className="sr-only">
          Tab indents. Press Escape, then Tab, to leave the editor. Press Control or Command plus Enter to run the code
          in your browser.
        </p>
      </div>

      {editorMode === "ready" && editorFocused && !isCoarse ? (
        <p className="home-code-hint" aria-hidden="true">
          <span>
            <kbd>Esc</kbd> then <kbd>Tab</kbd> leaves
          </span>
          <span>
            <kbd>{modifierLabel}</kbd>+<kbd>Enter</kbd> runs
          </span>
        </p>
      ) : null}

      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Scrollable output region must be keyboard focusable */}
      <div ref={termRef} className="home-term" role="region" aria-label="Python program output" tabIndex={0}>
        <div className="home-term-bar">
          <span className="home-term-line">
            <span className="home-term-prompt">$</span> python {HERO_FILENAME}
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
        Interactive Python editor with {HERO_FILENAME}: sums three expenses, prints each category, and shows the remaining
        budget. Click Run to execute real Python in your browser, or Write your own to edit the code.
      </figcaption>

      <div className="home-editor-foot">
        <Link href="/courses/python-fundamentals" className="home-pill home-pill-link">
          Python Fundamentals
        </Link>
        <span className="home-pill">Runs in your browser</span>
        <a href={hafaCodeLink.url} target="_blank" rel="noopener noreferrer" className="home-pill-ext">
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

      {showKeys
        ? createPortal(
            <CodingKeys
              busy={isBusy}
              onKey={handleKey}
              onRun={handleKeysRun}
              onStop={stopRun}
              onLayout={handleKeysLayout}
            />,
            document.body,
          )
        : null}
    </figure>
  )
}
