"use client"

import { ChevronDown } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import { PYTHON_EXAMPLES } from "@/lib/python-sample"

/** A filename tab with a keyboard-operated, single-select listbox. Focus stays on the trigger. */
export function ExamplePicker({ value, modified, onChange }: { value: string; modified: boolean; onChange: (filename: string) => void }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const id = useId()
  const selected = PYTHON_EXAMPLES.findIndex(example => example.filename === value)
  const show = () => { setActive(selected); setOpen(true) }
  const choose = (index: number) => {
    setOpen(false)
    onChange(PYTHON_EXAMPLES[index].filename)
  }

  useEffect(() => {
    if (!open) return
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    return () => document.removeEventListener("pointerdown", close)
  }, [open])

  useEffect(() => {
    if (open) list.current?.children[active]?.scrollIntoView?.({ block: "nearest" })
  }, [open, active])

  return (
    <div ref={root} className="home-example-picker" onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
    }}>
      <button
        type="button"
        role="combobox"
        aria-label="Python example"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        className="home-editor-file"
        onClick={() => open ? setOpen(false) : show()}
        onKeyDown={event => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault()
            if (!open) { show(); return }
            setActive(index => event.key === "Home" ? 0 : event.key === "End" ? PYTHON_EXAMPLES.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + PYTHON_EXAMPLES.length) % PYTHON_EXAMPLES.length)
          } else if (event.key === "Escape") {
            event.preventDefault()
            setOpen(false)
          } else if ((event.key === "Enter" || event.key === " ") && open) {
            event.preventDefault()
            choose(active)
          } else if (event.key === "Tab") setOpen(false)
        }}
      >
        <span>{value}</span>
        {modified ? <b className="home-editor-dirty" aria-label="Modified" /> : null}
        <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </button>
      <ul ref={list} id={id} role="listbox" aria-label="Python examples" hidden={!open} className="home-example-list">
        {PYTHON_EXAMPLES.map((example, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- Keyboard selection is delegated to the combobox via aria-activedescendant.
          <li
            key={example.filename}
            id={`${id}-${index}`}
            role="option"
            aria-selected={selected === index}
            data-active={active === index ? "" : undefined}
            onPointerDown={event => event.preventDefault()}
            onPointerMove={() => setActive(index)}
            onClick={() => choose(index)}
          >
            {example.filename}
          </li>
        ))}
      </ul>
    </div>
  )
}
