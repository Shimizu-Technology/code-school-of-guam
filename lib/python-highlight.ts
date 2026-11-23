import { highlightTree, tagHighlighter, tags as t } from "@lezer/highlight"
import { parser } from "@lezer/python"

/**
 * One tag → class map shared by the server-rendered (read-only) hero code and the
 * lazily loaded CodeMirror editor, so both paint the same colors from the same CSS
 * (`.home-tok-*` in app/home.css) and the swap between them is invisible.
 *
 * This module is imported only by Server Components and by the lazy editor chunk —
 * never by the HeroEditor client component — so it adds nothing to first-load JS.
 */
export const pythonHighlighter = tagHighlighter([
  { tag: [t.keyword, t.controlKeyword, t.operatorKeyword, t.definitionKeyword, t.moduleKeyword, t.modifier, t.self], class: "home-tok-k" },
  { tag: [t.string, t.special(t.string)], class: "home-tok-s" },
  { tag: t.escape, class: "home-tok-e" },
  { tag: [t.number, t.bool, t.null], class: "home-tok-n" },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.function(t.definition(t.variableName))], class: "home-tok-f" },
  { tag: t.definition(t.className), class: "home-tok-t" },
  { tag: t.comment, class: "home-tok-c" },
])

export type HighlightedSpan = { text: string; className: string }

/** Splits highlighted Python into lines of spans (unstyled text has an empty class). */
export function highlightPythonLines(code: string): HighlightedSpan[][] {
  const lines: HighlightedSpan[][] = [[]]
  const push = (text: string, className: string) => {
    const parts = text.split("\n")
    parts.forEach((part, index) => {
      if (index > 0) lines.push([])
      if (part) lines[lines.length - 1].push({ text: part, className })
    })
  }
  const tree = parser.parse(code)
  let pos = 0
  highlightTree(tree, pythonHighlighter, (from, to, classes) => {
    if (from > pos) push(code.slice(pos, from), "")
    push(code.slice(from, to), classes)
    pos = to
  })
  if (pos < code.length) push(code.slice(pos), "")
  return lines
}
