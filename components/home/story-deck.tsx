"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react"
import { useMotionOK } from "./use-motion-ok"

export const GRADUATE_STORIES = [
  { quote: "CSG matched the effort I gave it. Trust the process and keep showing up.", name: "Noah Peredo", role: "Cohort 1 graduate", photo: "/images/home/headshot-noah.webp" },
  { quote: "Now I constantly think about ways I can improve daily life by creating apps.", name: "Jessica Fernandez", role: "Cohort 1 graduate", photo: "/images/home/headshot-jess.webp" },
  { quote: "The support, guidance, and encouragement throughout the program were second to none.", name: "Junior O’Brien", role: "Cohort 2 graduate", photo: "/images/home/headshot-junior.webp" },
] as const

const FLY_MS = 260

function restingTransform(depth: number) {
  const rotate = depth === 0 ? 0 : depth % 2 ? 3 : -2.5
  return `translate3d(0, ${depth * 14}px, 0) scale(${1 - depth * 0.05}) rotate(${rotate}deg)`
}

/** A stack of quote cards. The Next button or a sideways flick sends the top card to the back. */
export function StoryDeck() {
  const motionOK = useMotionOK()
  const [order, setOrder] = useState<number[]>(() => GRADUATE_STORIES.map((_, i) => i))
  const [shown, setShown] = useState(0)
  const [flying, setFlying] = useState<{ index: number; dir: number } | null>(null)
  const [returning, setReturning] = useState<number | null>(null)
  const drag = useRef<{ index: number; x0: number; t0: number; dx: number; id: number } | null>(null)
  const busy = useRef(false)

  const sendBack = (dir: number) => {
    if (busy.current) return
    const top = order[0]
    const rotate = () => {
      setOrder((current) => [...current.slice(1), current[0]])
      setShown((n) => n + 1)
    }
    if (!motionOK) { rotate(); return }
    busy.current = true
    setFlying({ index: top, dir })
    window.setTimeout(() => {
      setFlying(null)
      setReturning(top)
      rotate()
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setReturning(null)
        busy.current = false
      }))
    }, FLY_MS)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>, index: number) => {
    if (index !== order[0] || drag.current || busy.current) return
    if (event.pointerType === "mouse" && event.button !== 0) return
    drag.current = { index, x0: event.clientX, t0: performance.now(), dx: 0, id: event.pointerId }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.currentTarget.dataset.dragging = ""
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || event.pointerId !== d.id) return
    d.dx = event.clientX - d.x0
    event.currentTarget.style.transform = `translate3d(${d.dx}px, 0, 0) rotate(${d.dx * 0.06}deg)`
  }

  // Ends a drag and returns the card to rest. Returns the gesture, or null.
  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || event.pointerId !== d.id) return null
    drag.current = null
    const el = event.currentTarget
    delete el.dataset.dragging
    el.style.transform = ""
    return d
  }

  // A cancelled pointer (for example, the browser taking over a scroll) never advances the deck.
  const onPointerCancel = (event: ReactPointerEvent<HTMLElement>) => { endDrag(event) }

  const onPointerEnd = (event: ReactPointerEvent<HTMLElement>) => {
    const d = endDrag(event)
    if (!d) return
    const velocity = Math.abs(d.dx) / Math.max(1, performance.now() - d.t0)
    if (Math.abs(d.dx) > 110 || (velocity > 0.11 && Math.abs(d.dx) > 12)) sendBack(d.dx > 0 ? 1 : -1)
  }

  return (
    <div className="home-deck-area">
      <div>
        <p className="csg-label text-ruby-700">Graduate stories</p>
        <h2 className="home-h2" data-reveal>Learning, in their words.</h2>
        <div className="home-deck-ctrl">
          <button type="button" className="csg-button-secondary" onClick={() => sendBack(-1)} aria-controls="home-story-deck">
            Next story <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="home-deck-count" aria-live="polite">Story {(shown % order.length) + 1} of {order.length}</span>
        </div>
      </div>
      <div className="home-deck" id="home-story-deck">
        {GRADUATE_STORIES.map((story, index) => {
          const depth = order.indexOf(index)
          const isTop = depth === 0
          let transform = restingTransform(depth)
          let opacity = depth > 2 ? 0 : 1
          if (flying?.index === index) {
            transform = `translate3d(${flying.dir * 120}%, -20px, 0) rotate(${flying.dir * 18}deg)`
            opacity = 0
          }
          if (returning === index) opacity = 0
          return (
            <figure
              key={story.name}
              className="home-qcard"
              data-top={isTop ? "" : undefined}
              data-instant={returning === index ? "" : undefined}
              aria-hidden={isTop ? undefined : true}
              style={{ zIndex: GRADUATE_STORIES.length - depth, transform, opacity }}
              onPointerDown={(event) => onPointerDown(event, index)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerCancel}
            >
              <div className="home-qmark" aria-hidden="true">“</div>
              <blockquote>{story.quote}</blockquote>
              <figcaption className="home-qby">
                <span className="home-avatar"><Image src={story.photo} alt="" width={46} height={46} sizes="46px" /></span>
                <span>{story.name}<span className="home-qrole">{story.role}</span></span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </div>
  )
}
