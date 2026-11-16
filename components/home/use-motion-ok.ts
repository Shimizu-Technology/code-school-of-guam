"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: no-preference)"

function subscribe(onChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/** Reads the preference directly (used to skip the brief still pass during hydration). */
export function motionAllowedNow() {
  return getSnapshot()
}

function getSnapshot() {
  return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(QUERY).matches
}

/**
 * True only in the browser when the visitor has not asked for reduced motion.
 * The server render (and the first hydration pass) is always the still version,
 * so every section is complete and readable before any motion starts.
 */
export function useMotionOK() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}

/** Live result of a media query; the server render and hydration pass use `false`. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined" || !window.matchMedia) return () => {}
      const media = window.matchMedia(query)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(query).matches,
    () => false,
  )
}
