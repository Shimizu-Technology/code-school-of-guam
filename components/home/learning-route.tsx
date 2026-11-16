"use client"

import { useEffect, useRef } from "react"
import { motionAllowedNow, useMotionOK } from "./use-motion-ok"

export const LEARNING_STEPS = [
  { title: "Write your first lines", body: "Learn Python basics in your browser. No setup to fight with before you start.", tag: "Python Fundamentals" },
  { title: "Build something useful", body: "Turn the basics into a small program you can explain, like a summary of your expenses.", tag: "Guided project" },
  { title: "Bring your questions", body: "Get feedback in a weekly private Zoom hour, so you understand what you built.", tag: "Weekly check-in" },
  { title: "Go further", body: "Continue with later courses as they open, or join updates for the full bootcamp.", tag: "Courses · Bootcamp" },
] as const

const SVG_NS = "http://www.w3.org/2000/svg"

/**
 * A dotted route links the four steps. With motion allowed, a ruby line draws
 * along it as the section scrolls past; otherwise the route is shown complete.
 */
export function LearningRoute() {
  const motionOK = useMotionOK()
  const journeyRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const baseRef = useRef<SVGPathElement>(null)
  const drawRef = useRef<SVGPathElement>(null)
  const nodesRef = useRef<SVGGElement>(null)
  const tipRef = useRef<SVGGElement>(null)

  useEffect(() => {
    // During hydration the first pass is the still version; wait for the real preference.
    if (!motionOK && motionAllowedNow()) return
    const journey = journeyRef.current
    const svg = svgRef.current
    const base = baseRef.current
    const draw = drawRef.current
    const nodesG = nodesRef.current
    const tip = tipRef.current
    if (!journey || !svg || !base || !draw || !nodesG || !tip) return

    let total = 0
    let nodeAt: number[] = []
    let nodeEls: SVGCircleElement[] = []
    let shown = motionOK ? 0 : 1
    let target = shown
    let raf = 0

    const paint = (p: number) => {
      const length = total * p
      draw.style.strokeDashoffset = String(total - length)
      const point = draw.getPointAtLength(Math.max(length, 0.01))
      tip.setAttribute("transform", `translate(${point.x} ${point.y})`)
      tip.style.opacity = motionOK && p > 0.002 && p < 0.998 ? "1" : "0"
      nodeEls.forEach((node, i) => node.classList.toggle("is-on", p >= nodeAt[i] - 0.002))
    }

    const build = () => {
      const stops = Array.from(journey.querySelectorAll<HTMLElement>(".home-stop"))
      const W = journey.clientWidth
      const H = journey.clientHeight
      const narrow = window.innerWidth < 900
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`)
      const x = narrow ? 14 : W / 2
      const bulge = narrow ? 0 : W * 0.09
      const points: [number, number][] = [[x, narrow ? 0 : -40], ...stops.map((s): [number, number] => [x, s.offsetTop + s.offsetHeight / 2]), [x, H + (narrow ? 0 : 20)]]
      let d = `M${points[0][0]} ${points[0][1]}`
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1]
        const b = points[i]
        const dy = b[1] - a[1]
        const side = (i % 2 ? 1 : -1) * bulge
        d += ` C${a[0] + side} ${a[1] + dy * 0.35} ${b[0] + side} ${b[1] - dy * 0.35} ${b[0]} ${b[1]}`
      }
      base.setAttribute("d", d)
      draw.setAttribute("d", d)
      total = draw.getTotalLength()
      draw.style.strokeDasharray = String(total)
      nodesG.replaceChildren()
      nodeEls = []
      nodeAt = []
      let lo = 0
      points.slice(1, -1).forEach(([px, py]) => {
        const circle = document.createElementNS(SVG_NS, "circle")
        circle.setAttribute("class", "home-route-node")
        circle.setAttribute("cx", String(px))
        circle.setAttribute("cy", String(py))
        circle.setAttribute("r", "9")
        nodesG.appendChild(circle)
        nodeEls.push(circle)
        let best = lo
        let bestDistance = Infinity
        for (let L = lo; L <= total; L += 6) {
          const q = draw.getPointAtLength(L)
          const distance = Math.abs(q.y - py) + Math.abs(q.x - px)
          if (distance < bestDistance) { bestDistance = distance; best = L }
          if (q.y > py + 40) break
        }
        nodeAt.push(total ? best / total : 1)
        lo = best
      })
      paint(shown)
    }

    // Progress runs from the route's top at 70% of the viewport to its bottom at 55%.
    const measure = () => {
      const rect = journey.getBoundingClientRect()
      const vh = window.innerHeight
      return Math.min(1, Math.max(0, (vh * 0.7 - rect.top) / (rect.height + vh * 0.15)))
    }

    const step = () => {
      raf = 0
      shown += (target - shown) * 0.18
      if (Math.abs(target - shown) < 0.001) shown = target
      paint(shown)
      if (shown !== target) raf = requestAnimationFrame(step)
    }

    const onScroll = () => {
      target = measure()
      if (!raf) raf = requestAnimationFrame(step)
    }

    build()
    const resize = new ResizeObserver(() => build())
    resize.observe(journey)
    if (motionOK) {
      shown = target = measure()
      paint(shown)
      window.addEventListener("scroll", onScroll, { passive: true })
    }
    return () => {
      resize.disconnect()
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [motionOK])

  return (
    <div ref={journeyRef} className="home-journey">
      <svg ref={svgRef} className="home-route" aria-hidden="true" focusable="false">
        <path ref={baseRef} className="home-route-base" />
        <path ref={drawRef} className="home-route-draw" />
        <g ref={nodesRef} />
        <g ref={tipRef} className="home-route-tip" style={{ opacity: 0 }}>
          <circle r="14" className="home-route-halo" />
          <circle r="6" />
        </g>
      </svg>
      <ol className="home-stops">
        {LEARNING_STEPS.map((step, i) => (
          <li key={step.title} className="home-stop" data-reveal>
            <p className="home-step-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</p>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
            <span className="home-tag">{step.tag}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
