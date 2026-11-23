"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useLayoutEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { PYTHON_EXAMPLES } from "@/lib/python-sample"

/** A filename tab with a keyboard-operated, single-select listbox. Focus stays on the trigger. */
export function ExamplePicker({ value, modified, onChange }: { value: string; modified: boolean; onChange: (filename: string) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const id = useId()
  const selected = PYTHON_EXAMPLES.findIndex(example => example.filename === value)
  const show = () => {
    trigger.current?.focus({ preventScroll: true })
    setActive(selected)
    setOpen(true)
  }
  const choose = (index: number) => {
    setOpen(false)
    trigger.current?.focus({ preventScroll: true })
    onChange(PYTHON_EXAMPLES[index].filename)
  }

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node) && !list.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    const vv = window.visualViewport
    let frame = 0
    let opening = true
    const place = () => {
      frame = 0
      const button = trigger.current
      const menu = list.current
      if (!button || !menu) return
      let rect = button.getBoundingClientRect()
      const left = vv?.offsetLeft ?? 0
      const top = vv?.offsetTop ?? 0
      const width = vv?.width ?? window.innerWidth
      const height = vv?.height ?? window.innerHeight
      // A trigger near the bottom needs room for at least a few options. Move the
      // document once on opening; subsequent viewport changes only reposition the list.
      if (opening && top + height - rect.bottom < Math.min(180, height / 2)) {
        const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? top
        const target = Math.min(top + height - 64, Math.max(top + 8, header + 8))
        window.scrollBy({ top: rect.top - target, behavior: "auto" })
        rect = button.getBoundingClientRect()
      }
      opening = false
      const menuTop = Math.max(top + 8, rect.bottom + 4)
      const menuWidth = Math.min(280, width - 16)
      menu.style.width = `${menuWidth}px`
      menu.style.left = `${Math.max(left + 8, Math.min(rect.left, left + width - menuWidth - 8))}px`
      menu.style.top = `${menuTop}px`
      menu.style.maxHeight = `${Math.max(0, Math.min(330, top + height - menuTop - 8))}px`
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(place) }
    place()
    vv?.addEventListener("resize", schedule)
    vv?.addEventListener("scroll", schedule)
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", schedule, true)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      vv?.removeEventListener("resize", schedule)
      vv?.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", schedule, true)
    }
  }, [open])

  useEffect(() => {
    const menu = list.current
    const option = menu?.children[active] as HTMLElement | undefined
    if (!open || !menu || !option) return
    // Scroll the list itself, without moving the document or fighting a touch swipe.
    if (option.offsetTop < menu.scrollTop) menu.scrollTop = option.offsetTop
    else if (option.offsetTop + option.offsetHeight > menu.scrollTop + menu.clientHeight) {
      menu.scrollTop = option.offsetTop + option.offsetHeight - menu.clientHeight
    }
  }, [open, active])

  return (
    <div ref={root} className="home-example-picker" onBlur={event => {
      if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && !list.current?.contains(event.relatedTarget)) setOpen(false)
    }}>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-label={modified ? "Python example (modified)" : "Python example"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        className="home-editor-file"
        title={value}
        onClick={() => open ? setOpen(false) : show()}
        onKeyDown={event => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault()
            if (!open) { show(); return }
            setActive(index => event.key === "Home" ? 0 : event.key === "End" ? PYTHON_EXAMPLES.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + PYTHON_EXAMPLES.length) % PYTHON_EXAMPLES.length)
          } else if (event.key === "Escape" && open) {
            event.preventDefault()
            setOpen(false)
          } else if ((event.key === "Enter" || event.key === " ") && open) {
            event.preventDefault()
            choose(active)
          } else if (event.key === "Tab") setOpen(false)
        }}
      >
        <span>{value}</span>
        {modified ? <b className="home-editor-dirty" aria-hidden="true" /> : null}
        <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>
      {open ? createPortal(<ul ref={list} id={id} role="listbox" aria-label="Python examples" className="home-example-list">
        {PYTHON_EXAMPLES.map((example, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Keyboard selection is delegated to the combobox via aria-activedescendant.
          <li
            key={example.filename}
            id={`${id}-${index}`}
            role="option"
            aria-selected={selected === index}
            data-active={active === index ? "" : undefined}
            onMouseDown={event => event.preventDefault()}
            onPointerMove={event => { if (event.pointerType === "mouse") setActive(index) }}
            onClick={() => choose(index)}
          >
            {example.filename}
          </li>
        ))}
      </ul>, document.body) : null}
    </div>
  )
}
