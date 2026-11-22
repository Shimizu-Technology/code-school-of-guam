"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import { motionAllowedNow, useMediaQuery, useMotionOK } from "./use-motion-ok"

/**
 * The Cohort 1 hybrid-class photo opens from a framed card to full width as the
 * section scrolls. The section is only tall and sticky when motion is allowed;
 * otherwise (and before scripts run) it is a normal, fully open photo section.
 */
export function OpeningPhoto() {
  const motionAllowed = useMotionOK()
  // Short screens (an iPhone SE in portrait) get the still layout: a sticky
  // stage there would squeeze the photo and hide the copy.
  const tallEnough = useMediaQuery("(min-height: 640px)")
  const motionOK = motionAllowed && tallEnough
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // During hydration the first pass is the still version; wait for the real preference.
    if (!motionOK && motionAllowedNow() && window.matchMedia("(min-height: 640px)").matches) return
    const section = sectionRef.current
    const sticky = stickyRef.current
    if (!section || !sticky) return
    if (!motionOK) {
      section.style.removeProperty("--p")
      return
    }
    let shown = -1
    let target = 0
    let raf = 0
    let stickyTop = parseFloat(getComputedStyle(sticky).top) || 0
    const measure = () => {
      const rect = section.getBoundingClientRect()
      const distance = rect.height - sticky.offsetHeight
      return distance > 0 ? Math.min(1, Math.max(0, (stickyTop - rect.top) / distance)) : 1
    }
    const step = () => {
      raf = 0
      shown = shown < 0 ? target : shown + (target - shown) * 0.2
      if (Math.abs(target - shown) < 0.001) shown = target
      section.style.setProperty("--p", shown.toFixed(4))
      if (shown !== target) raf = requestAnimationFrame(step)
    }
    const onScroll = () => {
      target = measure()
      if (!raf) raf = requestAnimationFrame(step)
    }
    const onResize = () => {
      stickyTop = parseFloat(getComputedStyle(sticky).top) || 0
      onScroll()
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
    }
  }, [motionOK])

  return (
    <section ref={sectionRef} id="teaching" className="home-expand" data-motion={motionOK ? "" : undefined} aria-labelledby="home-teaching-title">
      <div ref={stickyRef} className="home-expand-sticky">
        <div className="home-expand-figure">
          <div className="home-expand-media">
            <Image
              src="/images/home/cohort1-hybrid-class.webp"
              alt="Cohort 1 students working on laptops around a table, smiling, while a classmate joins on a TV over Zoom"
              fill
              sizes="100vw"
              quality={70}
              className="home-expand-img"
            />
          </div>
          <div className="home-expand-copy">
            <div className="container mx-auto px-4 sm:px-8">
              <p className="csg-label text-[#ffe0dc]">Practice with guidance</p>
              <h2 id="home-teaching-title">Bring your questions. Build your understanding.</h2>
              <p className="home-expand-lead">The school grew from Leon&apos;s experience learning with an instructor. Our guided offers make room for questions, feedback, and practice.</p>
              <p className="home-expand-caption">Photo: Cohort 1&apos;s first in-person class, with a classmate joining on the TV over Zoom.</p>
              <Link href="/about" className="home-expand-link csg-press">Meet the school <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
