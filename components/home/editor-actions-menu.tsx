"use client"

import { MoreHorizontal } from "lucide-react"
import { useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

/** Phone-only actions. The portal stays clear of the figure's clipped corners. */
export function EditorActionsMenu({ onClear, onReset }: { onClear: () => void; onReset: () => void }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const id = useId()
  const openAtEnd = useRef(false)
  const close = () => {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
  }

  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const button = trigger.current
      const popup = menu.current
      if (!button || !popup) return
      const rect = button.getBoundingClientRect()
      const vv = window.visualViewport
      const left = vv?.offsetLeft ?? 0
      const top = vv?.offsetTop ?? 0
      const width = vv?.width ?? innerWidth
      const height = vv?.height ?? innerHeight
      popup.style.left = `${Math.max(left + 8, Math.min(rect.right - popup.offsetWidth, left + width - popup.offsetWidth - 8))}px`
      popup.style.top = `${Math.max(top + 8, Math.min(rect.bottom + 4, top + height - popup.offsetHeight - 8))}px`
    }
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) {
        setOpen(false)
        // Pointerdown's native focus change has finished by pointerup. Preserve
        // an explicitly clicked control; otherwise return focus to the trigger.
        if (!(event.target instanceof Element) || !event.target.closest('button, a, input, textarea, [tabindex]:not([tabindex="-1"])')) trigger.current?.focus({ preventScroll: true })
      }
    }
    const resize = () => {
      if (!trigger.current?.getClientRects().length) {
        setOpen(false)
        return
      }
      place()
    }
    place()
    const items = menu.current?.querySelectorAll<HTMLButtonElement>("button")
    items?.[openAtEnd.current ? items.length - 1 : 0]?.focus({ preventScroll: true })
    document.addEventListener("pointerup", outside)
    window.addEventListener("resize", resize)
    window.addEventListener("scroll", place, true)
    window.visualViewport?.addEventListener("resize", place)
    return () => {
      document.removeEventListener("pointerup", outside)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", place, true)
      window.visualViewport?.removeEventListener("resize", place)
    }
  }, [open])

  return (
    <div className="home-actions-overflow">
      <button ref={trigger} type="button" className="home-ed-btn" aria-label="More editor actions" title="More editor actions" aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined}
        onClick={() => { openAtEnd.current = false; if (open) close(); else setOpen(true) }}
        onKeyDown={event => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            openAtEnd.current = event.key === "ArrowUp"
            setOpen(true)
          }
        }}>
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </button>
      {open ? createPortal(
        <div ref={menu} id={id} role="menu" tabIndex={-1} aria-label="Editor actions" className="home-actions-menu"
          onKeyDown={event => {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"))
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement)
            if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
              event.preventDefault()
              const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) % buttons.length
              buttons[next].focus({ preventScroll: true })
            } else if (event.key === "Escape") {
              event.preventDefault()
              event.stopPropagation()
              close()
            } else if (event.key === "Tab") close()
          }}>
          <button type="button" role="menuitem" aria-label="Clear Python editor" onClick={() => { close(); onClear() }}>Clear</button>
          <button type="button" role="menuitem" aria-label="Reset to original Python example" onClick={() => { close(); onReset() }}>Reset</button>
        </div>, document.body,
      ) : null}
    </div>
  )
}
