"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motionAllowedNow, useMotionOK } from "./use-motion-ok"

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

export const EDITOR_OUTPUT = ["Total: $118", "Food: $61", "Transport: $48", "Supplies: $9", "Under budget by $2"] as const

// Typing schedule: [line, token, characters] at a time offset in ms.
type Step = { at: number; line: number; token: number; chars: number }

function buildSchedule() {
  const steps: Step[] = []
  let t = 200
  EDITOR_LINES.forEach((line, li) => {
    if (!line.length) t += 60
    line.forEach(([kind, text], ti) => {
      for (let c = 1; c <= text.length; c++) {
        steps.push({ at: t, line: li, token: ti, chars: c })
        t += kind === "s" ? 7 : 12
      }
    })
    t += 60
  })
  return { steps, typedAt: t }
}

const RUN_PRESS = 160
const RUN_FIRST_LINE = 380
const RUN_LINE_GAP = 220

type Frame = { line: number; token: number; chars: number } | "all"

function renderLine(line: readonly Token[], upto: { token: number; chars: number } | null) {
  if (!line.length) return " "
  return line.map(([kind, text], ti) => {
    if (upto && ti > upto.token) return null
    const shown = upto && ti === upto.token ? text.slice(0, upto.chars) : text
    return kind ? <span key={ti} className={`home-tok-${kind}`}>{shown}</span> : <span key={ti}>{shown}</span>
  })
}

export function HeroEditor() {
  const motionOK = useMotionOK()
  const schedule = useMemo(buildSchedule, [])
  const rootRef = useRef<HTMLElement>(null)
  const rafRef = useRef(0)
  const startedRef = useRef(false)
  const [frame, setFrame] = useState<Frame>("all")
  // Output lines shown and whether the Run button looks pressed.
  const [outputCount, setOutputCount] = useState<number>(EDITOR_OUTPUT.length)
  const [pressed, setPressed] = useState(false)
  const [ready, setReady] = useState(false)

  const stop = () => cancelAnimationFrame(rafRef.current)

  const run = useCallback((typeFirst: boolean) => {
    stop()
    const start = performance.now()
    const runAt = typeFirst ? schedule.typedAt + 200 : 0
    const tick = (now: number) => {
      const elapsed = now - start
      if (typeFirst && elapsed < schedule.typedAt) {
        // Binary search the last step that has started.
        let lo = 0
        let hi = schedule.steps.length - 1
        let found = -1
        while (lo <= hi) {
          const mid = (lo + hi) >> 1
          if (schedule.steps[mid].at <= elapsed) { found = mid; lo = mid + 1 } else hi = mid - 1
        }
        const step = found >= 0 ? schedule.steps[found] : { line: 0, token: -1, chars: 0 }
        setFrame({ line: step.line, token: step.token, chars: step.chars })
        setOutputCount(-1)
      } else {
        setFrame("all")
        const sinceRun = elapsed - runAt
        setPressed(sinceRun >= 0 && sinceRun < RUN_PRESS)
        const lines = sinceRun < RUN_PRESS ? -1 : Math.min(EDITOR_OUTPUT.length, Math.floor((sinceRun - RUN_FIRST_LINE) / RUN_LINE_GAP) + 1)
        setOutputCount(Math.max(sinceRun < RUN_PRESS ? -1 : 0, lines))
        if (lines >= EDITOR_OUTPUT.length) return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [schedule])

  // Type the program once, the first time the editor is on screen.
  useEffect(() => {
    // During hydration the first pass is the still version; wait for the real preference.
    if (!motionOK && motionAllowedNow()) return
    if (!motionOK) {
      stop()
      setFrame("all")
      setOutputCount(EDITOR_OUTPUT.length)
      setPressed(false)
      setReady(true)
      return
    }
    const el = rootRef.current
    if (!el || startedRef.current) { setReady(true); return }
    setFrame({ line: 0, token: -1, chars: 0 })
    setOutputCount(-1)
    setReady(true)
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting) && !startedRef.current) {
        startedRef.current = true
        observer.disconnect()
        run(true)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => { observer.disconnect(); stop() }
  }, [motionOK, run])

  const replay = () => {
    startedRef.current = true
    if (motionOK) run(false)
    else { setFrame("all"); setOutputCount(EDITOR_OUTPUT.length) }
  }

  const typing = frame !== "all"

  return (
    <figure ref={rootRef} className="home-editor home-fade" style={{ ["--i" as string]: 3 }} data-ready={ready ? "" : undefined} aria-labelledby="home-editor-caption">
      <div className="home-editor-top">
        <div className="home-editor-tabs" aria-hidden="true"><i /><i /><i /><span>expense_summary.py</span></div>
        <button type="button" className="home-run" data-pressed={pressed ? "" : undefined} onClick={replay} aria-label="Run the sample program again">
          <svg viewBox="0 0 10 12" width="9" height="11" aria-hidden="true"><path d="M0 0 10 6 0 12Z" fill="currentColor" /></svg>
          Run
        </button>
      </div>
      <pre className="home-code" aria-hidden="true">
        {EDITOR_LINES.map((line, li) => {
          if (typing && li > frame.line) return null
          const upto = typing && li === frame.line ? { token: frame.token, chars: frame.chars } : null
          return (
            <span key={li} className="home-ln">
              {renderLine(line, upto)}
              {upto ? <span className="home-caret" /> : null}
            </span>
          )
        })}
      </pre>
      <div className="home-term" aria-hidden="true">
        {outputCount >= 0 ? <span className="home-term-line"><span className="home-term-prompt">$</span> python expense_summary.py</span> : null}
        {EDITOR_OUTPUT.slice(0, Math.max(0, outputCount)).map((line, i) => (
          <span key={line} className={i === EDITOR_OUTPUT.length - 1 ? "home-term-line home-term-ok" : "home-term-line"}>{line}</span>
        ))}
      </div>
      <figcaption id="home-editor-caption" className="sr-only">
        Sample program from Python Fundamentals: expense_summary.py adds up three expenses, prints each one, and reports that the $118 total is under the $120 budget by $2.
      </figcaption>
      <div className="home-editor-foot">
        <Link href="/courses/python-fundamentals" className="home-pill home-pill-link">Python Fundamentals</Link>
        <span className="home-pill">3 guided weeks</span>
        <span className="home-pill">Weekly private Zoom hour</span>
      </div>
    </figure>
  )
}
