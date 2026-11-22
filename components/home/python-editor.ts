/**
 * The hero's CodeMirror 6 editor. This module (and everything it imports) is loaded
 * only when a visitor taps the code or "Write your own"; the first paint uses the
 * server-highlighted copy in python-code-static.tsx, which shares the highlighter and
 * CSS so the swap is invisible.
 */
import { EditorSelection, EditorState, Prec, RangeSetBuilder, findClusterBreak, countColumn, type StateCommand, type Extension } from "@codemirror/state"
import {
  Decoration,
  EditorView,
  ViewPlugin,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view"
import { LanguageSupport, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language"
import { defaultKeymap, history, historyKeymap, indentLess, indentMore, redo, undo } from "@codemirror/commands"
import { closeBrackets, closeBracketsKeymap, insertBracket } from "@codemirror/autocomplete"
import { pythonLanguage } from "@codemirror/lang-python"
import { hangingIndentCh, pythonHighlighter } from "@/lib/python-highlight"

export const INDENT = "    "

export type AccessoryKey =
  | "tab"
  | "colon"
  | "parens"
  | "brackets"
  | "braces"
  | "quotes"
  | "equals"
  | "hash"
  | "left"
  | "right"
  | "undo"
  | "redo"

function insertText(text: string): StateCommand {
  return ({ state, dispatch }) => {
    dispatch(
      state.update(state.replaceSelection(text), { scrollIntoView: true, userEvent: "input.type" }),
    )
    return true
  }
}

/** Inserts an empty pair with the cursor inside, or wraps the selection in it. */
export function wrapPair(open: string, close: string): StateCommand {
  return ({ state, dispatch }) => {
    if (state.selection.ranges.every((range) => range.empty)) {
      const tr = insertBracket(state, open)
      if (tr) { dispatch(tr); return true }
      return insertText(open)({ state, dispatch })
    }
    const tr = state.changeByRange((range) => {
      if (range.empty) {
        return {
          changes: { from: range.from, insert: open + close },
          range: EditorSelection.cursor(range.from + open.length),
        }
      }
      return {
        changes: [
          { from: range.from, insert: open },
          { from: range.to, insert: close },
        ],
        range: EditorSelection.range(range.from + open.length, range.to + open.length),
      }
    })
    dispatch(state.update(tr, { scrollIntoView: true, userEvent: "input.type" }))
    return true
  }
}

/**
 * Tab: with the cursor after code on a line, insert spaces to the next 4-column stop
 * (like Hafa Code's Monaco); at the start of a line or with a multi-line selection,
 * indent the whole line(s).
 */
export const smartTab: StateCommand = ({ state, dispatch }) => {
  const midLine = state.selection.ranges.every((range) => {
    if (!range.empty) return false
    const line = state.doc.lineAt(range.head)
    return /\S/.test(line.text.slice(0, range.head - line.from))
  })
  if (!midLine) return indentMore({ state, dispatch })
  const tr = state.changeByRange((range) => {
    const line = state.doc.lineAt(range.head)
    const column = countColumn(line.text.slice(0, range.head - line.from), state.tabSize)
    const spaces = INDENT.length - (column % INDENT.length)
    return {
      changes: { from: range.head, insert: " ".repeat(spaces) },
      range: EditorSelection.cursor(range.head + spaces),
    }
  })
  dispatch(state.update(tr, { scrollIntoView: true, userEvent: "input.indent" }))
  return true
}

function moveCursor(forward: boolean): StateCommand {
  return ({ state, dispatch }) => {
    const selection = EditorSelection.create(
      state.selection.ranges.map((range) => {
        if (!range.empty) return EditorSelection.cursor(forward ? range.to : range.from)
        const line = state.doc.lineAt(range.head)
        if (forward && range.head === line.to) return EditorSelection.cursor(Math.min(state.doc.length, range.head + 1))
        if (!forward && range.head === line.from) return EditorSelection.cursor(Math.max(0, range.head - 1))
        const next = findClusterBreak(line.text, range.head - line.from, forward)
        return EditorSelection.cursor(line.from + next)
      }),
      state.selection.mainIndex,
    )
    dispatch(state.update({ selection, scrollIntoView: true, userEvent: "select" }))
    return true
  }
}

export const accessoryCommands: Record<AccessoryKey, StateCommand> = {
  tab: smartTab,
  colon: insertText(":"),
  parens: wrapPair("(", ")"),
  brackets: wrapPair("[", "]"),
  braces: wrapPair("{", "}"),
  quotes: wrapPair('"', '"'),
  equals: insertText("="),
  hash: insertText("#"),
  left: moveCursor(false),
  right: moveCursor(true),
  undo,
  redo,
}

const hangCache = new Map<number, Decoration>()
function hangDecoration(ch: number) {
  let deco = hangCache.get(ch)
  if (!deco) {
    deco = Decoration.line({ attributes: { style: `--hang:${ch}ch` } })
    hangCache.set(ch, deco)
  }
  return deco
}

function buildHangs(view: EditorView): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>()
  for (const { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      const line = view.state.doc.lineAt(pos)
      builder.add(line.from, line.from, hangDecoration(hangingIndentCh(line.text)))
      pos = line.to + 1
    }
  }
  return builder.finish()
}

/** Wrapped continuation lines hang one indent deeper than the line itself. */
const hangingIndent = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet
    constructor(view: EditorView) {
      this.decorations = buildHangs(view)
    }
    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) this.decorations = buildHangs(update.view)
    }
  },
  { decorations: (plugin) => plugin.decorations },
)

export interface PythonEditorOptions {
  parent: HTMLElement
  doc: string
  ariaLabel: string
  describedBy?: string
  onChange: (doc: string) => void
  onRun: () => void
  onFocusChange: (focused: boolean) => void
  /** Space to keep clear around the cursor (sticky header above, coding keys below). */
  scrollMargins?: () => { top: number; bottom: number }
}

export interface PythonEditorHandle {
  readonly view: EditorView
  getDoc(): string
  /** Replaces the whole document as one undoable change. */
  setDoc(doc: string): void
  focus(): void
  blur(): void
  /** Puts the cursor at a screen point (falls back to the end of the code). */
  placeCursorAt(clientX: number, clientY: number): void
  placeCursorAtEnd(): void
  insertAtCursor(text: string): void
  runKey(key: AccessoryKey): void
  revealCursor(): void
  destroy(): void
}

export function pythonEditorExtensions(options: Pick<PythonEditorOptions, "ariaLabel" | "describedBy" | "onChange" | "onRun" | "onFocusChange" | "scrollMargins">): Extension[] {
  return [
    Prec.highest(
      keymap.of([
        {
          key: "Escape",
          run: (view) => { view.setTabFocusMode(2000); return true },
        },
        {
          key: "Mod-Enter",
          run: () => {
            options.onRun()
            return true
          },
        },
      ]),
    ),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    history(),
    new LanguageSupport(pythonLanguage),
    indentUnit.of(INDENT),
    EditorState.tabSize.of(4),
    indentOnInput(),
    bracketMatching(),
    // iOS may substitute typographic quotes before the bracket input handler sees them.
    Prec.highest(EditorView.inputHandler.of((view, from, to, text) => {
      const normalized = text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
      if (normalized === text || view.state.readOnly) return false
      const sel = view.state.selection.main
      const tr = from === sel.from && to === sel.to ? insertBracket(view.state, normalized) : null
      view.dispatch(tr ?? view.state.update({
        changes: { from, to, insert: normalized },
        selection: EditorSelection.cursor(from + normalized.length),
        userEvent: "input.type",
      }))
      return true
    })),
    closeBrackets(),
    syntaxHighlighting(pythonHighlighter),
    EditorView.lineWrapping,
    hangingIndent,
    keymap.of([
      ...closeBracketsKeymap,
      // Tab indents; Escape then Tab (CodeMirror's tab-focus escape) leaves the editor.
      { key: "Tab", run: smartTab, shift: indentLess },
      ...defaultKeymap,
      ...historyKeymap,
    ]),
    EditorView.contentAttributes.of({
      "aria-label": options.ariaLabel,
      ...(options.describedBy ? { "aria-describedby": options.describedBy } : {}),
      autocapitalize: "off",
      autocorrect: "off",
      spellcheck: "false",
      enterkeyhint: "enter",
    }),
    EditorView.scrollMargins.of(() => {
      const margins = options.scrollMargins?.()
      return margins ? { top: margins.top, bottom: margins.bottom } : null
    }),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) options.onChange(update.state.doc.toString())
      if (update.focusChanged) options.onFocusChange(update.view.hasFocus)
    }),
    EditorView.theme({}, { dark: true }),
  ]
}

export function createPythonEditor(options: PythonEditorOptions): PythonEditorHandle {
  const view = new EditorView({
    parent: options.parent,
    state: EditorState.create({ doc: options.doc, extensions: pythonEditorExtensions(options) }),
  })

  const handle: PythonEditorHandle = {
    view,
    getDoc: () => view.state.doc.toString(),
    setDoc(doc) {
      if (doc === view.state.doc.toString()) return
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: doc },
        selection: EditorSelection.cursor(Math.min(view.state.selection.main.head, doc.length)),
        userEvent: "input.reset",
      })
    },
    focus: () => view.focus(),
    blur: () => view.contentDOM.blur(),
    placeCursorAt(clientX, clientY) {
      const pos = view.posAtCoords({ x: clientX, y: clientY }, false)
      view.dispatch({ selection: EditorSelection.cursor(pos ?? view.state.doc.length) })
    },
    placeCursorAtEnd() {
      view.dispatch({ selection: EditorSelection.cursor(view.state.doc.length), scrollIntoView: true })
    },
    insertAtCursor(text) {
      if (!text) return
      view.dispatch(view.state.replaceSelection(text), { scrollIntoView: true, userEvent: "input.type" })
    },
    runKey(key) {
      accessoryCommands[key]({ state: view.state, dispatch: (tr) => view.dispatch(tr) })
    },
    revealCursor() {
      view.dispatch({ effects: EditorView.scrollIntoView(view.state.selection.main.head, { y: "nearest" }) })
    },
    destroy: () => view.destroy(),
  }
  return handle
}
