"use client"

import { useEffect } from "react"
import { useMotionOK } from "./use-motion-ok"

/**
 * Adds a gentle rise to [data-reveal] elements inside the homepage as they
 * enter the viewport. Elements already on screen are marked shown first, so
 * nothing above the fold flickers. Content stays readable at every step.
 */
export function RevealOnScroll({ rootId }: { rootId: string }) {
  const motionOK = useMotionOK()

  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || !motionOK || !("IntersectionObserver" in window)) return
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))
    const limit = window.innerHeight * 0.88
    for (const item of items) {
      if (item.getBoundingClientRect().top < limit) item.dataset.revealed = ""
    }
    root.dataset.reveal = "on"
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        ;(entry.target as HTMLElement).dataset.revealed = ""
        observer.unobserve(entry.target)
      }
    }, { rootMargin: "0px 0px 40px 0px" })
    items.filter((item) => !("revealed" in item.dataset)).forEach((item) => observer.observe(item))
    return () => {
      observer.disconnect()
      delete root.dataset.reveal
      items.forEach((item) => { item.dataset.revealed = "" })
    }
  }, [motionOK, rootId])

  return null
}
