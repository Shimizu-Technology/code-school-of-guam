"use client"

import { useEffect, useRef } from "react"
import { useMotionOK } from "./use-motion-ok"

/**
 * With a mouse or trackpad, letters thicken near the pointer (Newsreader's
 * weight axis). On touch screens they ripple once when the heading appears.
 * Reduced motion keeps a still heading. Screen readers get the plain text.
 */
export function WeightedHeading({ text, id }: { text: string; id?: string }) {
  const motionOK = useMotionOK()
  const visualRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const visual = visualRef.current
    if (!visual || !motionOK) return
    const chars = Array.from(visual.querySelectorAll<HTMLSpanElement>(".home-ch"))
    const weights = chars.map(() => 400)
    const setWeight = (i: number, w: number) => {
      weights[i] = w
      chars[i].style.fontVariationSettings = `'wght' ${w.toFixed(0)}`
    }
    let raf = 0
    const cleanups: (() => void)[] = []

    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const section = visual.closest("section") ?? visual
      let mx = -9999
      let my = -9999
      let centers: [number, number][] = []
      const measure = () => {
        centers = chars.map((c) => {
          const r = c.getBoundingClientRect()
          return [r.left + r.width / 2, r.top + r.height / 2]
        })
      }
      const frame = () => {
        let moving = false
        chars.forEach((_, i) => {
          const dx = mx - centers[i][0]
          const dy = my - centers[i][1]
          const target = 400 + 400 * Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 240)
          const w = weights[i] + (target - weights[i]) * 0.18
          if (Math.abs(w - weights[i]) > 0.5) moving = true
          setWeight(i, w)
        })
        raf = moving ? requestAnimationFrame(frame) : 0
      }
      const onEnter = () => measure()
      const onMove = (e: Event) => {
        const p = e as PointerEvent
        mx = p.clientX
        my = p.clientY
        if (!centers.length) measure()
        if (!raf) raf = requestAnimationFrame(frame)
      }
      const onLeave = () => {
        mx = -9999
        my = -9999
        if (!raf && centers.length) raf = requestAnimationFrame(frame)
      }
      const onScroll = () => { if (centers.length) measure() }
      section.addEventListener("pointerenter", onEnter)
      section.addEventListener("pointermove", onMove)
      section.addEventListener("pointerleave", onLeave)
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanups.push(() => {
        section.removeEventListener("pointerenter", onEnter)
        section.removeEventListener("pointermove", onMove)
        section.removeEventListener("pointerleave", onLeave)
        window.removeEventListener("scroll", onScroll)
      })
    } else {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        const start = performance.now()
        const duration = 1600
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration)
          chars.forEach((_, i) => {
            const phase = p * (chars.length + 6) - i
            setWeight(i, 400 + 380 * Math.max(0, Math.sin(Math.min(Math.max(phase / 6, 0), 1) * Math.PI)))
          })
          raf = p < 1 ? requestAnimationFrame(tick) : 0
        }
        raf = requestAnimationFrame(tick)
      }, { threshold: 0.6 })
      observer.observe(visual)
      cleanups.push(() => observer.disconnect())
    }
    return () => {
      cancelAnimationFrame(raf)
      cleanups.forEach((fn) => fn())
      chars.forEach((c) => { c.style.fontVariationSettings = "" })
    }
  }, [motionOK])

  return (
    <h2 id={id} className="home-vf">
      <span className="sr-only">{text}</span>
      <span ref={visualRef} aria-hidden="true">
        {text.split(" ").map((word, wi, words) => (
          <span key={wi}>
            <span className="home-vf-word">
              {word.split("").map((c, ci) => <span key={ci} className="home-ch">{c}</span>)}
            </span>
            {wi < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </h2>
  )
}
