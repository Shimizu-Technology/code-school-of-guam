"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motionAllowedNow, useMotionOK } from "./use-motion-ok"

export const CAPSTONE_CLIP = {
  src: "/videos/cohort2-capstone-zoom.mp4",
  poster: "/videos/cohort2-capstone-zoom-poster.webp",
  label: "Four people in a Zoom gallery smiling during a Cohort 2 capstone presentation; names are blurred. Silent clip.",
} as const

/**
 * Silent 9-second loop. With motion allowed it plays while on screen and pauses
 * off screen. With reduced motion it shows the poster and plays only on request.
 * An underlying poster image stays visible until the first video frame renders,
 * preventing WebKit from showing a blank dark-gray box before playback starts.
 */
export function CapstoneClip() {
  const motionOK = useMotionOK()
  const videoRef = useRef<HTMLVideoElement>(null)
  const userPausedRef = useRef(false)
  const userPlayedRef = useRef(false)
  const [mounted, setMounted] = useState(false)
  const [paused, setPaused] = useState(true)
  const [hasFrame, setHasFrame] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    // During hydration the first pass is the still version; wait for the real preference.
    if (!motionOK && motionAllowedNow()) return
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const sync = () => setPaused(video.paused)
    const onFrame = () => setHasFrame(true)
    if (video.readyState >= 2) setHasFrame(true)
    video.addEventListener("play", sync)
    video.addEventListener("pause", sync)
    video.addEventListener("loadeddata", onFrame)
    video.addEventListener("playing", onFrame)
    let observer: IntersectionObserver | undefined
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const wantsPlay = motionOK ? !userPausedRef.current : userPlayedRef.current
          if (entry.isIntersecting && wantsPlay) video.play().catch(() => setPaused(true))
          else if (!entry.isIntersecting && !video.paused) video.pause()
        }
      }, { threshold: 0.25 })
      observer.observe(video)
    }
    if (!motionOK && !userPlayedRef.current && !video.paused) video.pause()
    return () => {
      observer?.disconnect()
      video.removeEventListener("play", sync)
      video.removeEventListener("pause", sync)
      video.removeEventListener("loadeddata", onFrame)
      video.removeEventListener("playing", onFrame)
    }
  }, [motionOK])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      userPausedRef.current = false
      userPlayedRef.current = true
      video.muted = true
      video.play().catch(() => setPaused(true))
    } else {
      userPausedRef.current = true
      userPlayedRef.current = false
      video.pause()
    }
  }

  return (
    <figure className="home-live-media">
      <Image
        src={CAPSTONE_CLIP.poster}
        alt=""
        fill
        sizes="(min-width: 900px) 640px, 100vw"
        quality={75}
        className="home-live-poster"
      />
      <video
        ref={videoRef}
        id="home-capstone-clip"
        width={1280}
        height={720}
        muted
        loop
        playsInline
        preload="metadata"
        data-ready={hasFrame ? "true" : "false"}
        aria-label={CAPSTONE_CLIP.label}
        disablePictureInPicture
      >
        <source src={CAPSTONE_CLIP.src} type="video/mp4" />
      </video>
      <figcaption className="home-live-cap">
        <span>Cohort 2 capstone day, live on Zoom</span>
        {mounted ? (
          <button type="button" className="home-vid-toggle" aria-controls="home-capstone-clip" aria-label={paused ? "Play capstone clip" : "Pause capstone clip"} onClick={toggle}>
            {paused ? "Play" : "Pause"}
          </button>
        ) : null}
      </figcaption>
    </figure>
  )
}
