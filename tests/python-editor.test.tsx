import { afterEach, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { EditorSelection, EditorState, type Transaction } from '@codemirror/state'
import { deleteCharBackward, insertNewlineAndIndent, undo } from '@codemirror/commands'
import { EditorView } from '@codemirror/view'
import { accessoryCommands, createPythonEditor, pythonEditorExtensions, type PythonEditorHandle } from '../components/home/python-editor'
import { PythonCodeStatic } from '../components/home/python-code-static'
import { hangingIndentCh, highlightPythonLines } from '../lib/python-highlight'
import { DEFAULT_PYTHON_CODE } from '../lib/python-sample'

const noop = () => {}
const extensions = pythonEditorExtensions({ ariaLabel: 'Python code editor', onChange: noop, onRun: noop, onFocusChange: noop })

/** Builds a state from text where `|` marks the cursor (or `[`…`]` a selection). */
function stateOf(marked: string) {
  const from = marked.indexOf('[') >= 0 ? marked.indexOf('[') : marked.indexOf('|')
  const doc = marked.replace(/[|[\]]/g, '')
  const to = marked.indexOf(']') >= 0 ? marked.indexOf(']') - 1 : from
  return EditorState.create({ doc, selection: EditorSelection.single(from, to), extensions })
}

function apply(state: EditorState, command: (target: { state: EditorState; dispatch: (tr: Transaction) => void }) => boolean) {
  let next = state
  command({ state, dispatch: (tr) => { next = tr.state } })
  return next
}

function show(state: EditorState) {
  const { from, to } = state.selection.main
  const doc = state.doc.toString()
  return from === to ? doc.slice(0, from) + '|' + doc.slice(from) : doc.slice(0, from) + '[' + doc.slice(from, to) + ']' + doc.slice(to)
}

let editor: PythonEditorHandle | null = null
afterEach(() => { editor?.destroy(); editor = null; document.body.innerHTML = '' })

test('coding keys insert pairs with the cursor inside, or wrap a selection', () => {
  expect(show(apply(stateOf('print|'), accessoryCommands.parens))).toBe('print(|)')
  expect(show(apply(stateOf('x = |'), accessoryCommands.brackets))).toBe('x = [|]')
  expect(show(apply(stateOf('d = |'), accessoryCommands.braces))).toBe('d = {|}')
  expect(show(apply(stateOf('print(|)'), accessoryCommands.quotes))).toBe('print("|")')
  expect(show(apply(stateOf('print([total])'), accessoryCommands.parens))).toBe('print(([total]))')
  expect(show(apply(stateOf('if x|'), accessoryCommands.colon))).toBe('if x:|')
  expect(show(apply(stateOf('x |'), accessoryCommands.equals))).toBe('x =|')
  expect(show(apply(stateOf('|'), accessoryCommands.hash))).toBe('#|')
})

test('Tab indents a line from its start and inserts spaces to the next stop mid-line; Shift-Tab outdents', () => {
  expect(show(apply(stateOf('|print(1)'), accessoryCommands.tab))).toBe('    |print(1)')
  expect(show(apply(stateOf('x = 1|'), accessoryCommands.tab))).toBe('x = 1   |')
  expect(show(apply(stateOf('ab|'), accessoryCommands.tab))).toBe('ab  |')
  expect(show(apply(stateOf('[a\nb]'), accessoryCommands.tab))).toBe('    [a\n    b]')
})

test('left/right keys move the cursor across characters and lines; Undo reverts the last insert', () => {
  expect(show(apply(stateOf('ab|c'), accessoryCommands.left))).toBe('a|bc')
  expect(show(apply(stateOf('ab|c'), accessoryCommands.right))).toBe('abc|')
  expect(show(apply(stateOf('a\n|b'), accessoryCommands.left))).toBe('a|\nb')
  expect(show(apply(stateOf('a|\nb'), accessoryCommands.right))).toBe('a\n|b')
  expect(show(apply(stateOf('[abc]'), accessoryCommands.left))).toBe('|abc')
  const typed = apply(stateOf('print|'), accessoryCommands.parens)
  expect(show(apply(typed, undo))).toBe('print|')
})

test('Enter after a colon indents the next line; Python dedent keywords outdent', () => {
  expect(show(apply(stateOf('for x in y:|'), insertNewlineAndIndent))).toBe('for x in y:\n    |')
  expect(show(apply(stateOf('if a:\n    if b:|'), insertNewlineAndIndent))).toBe('if a:\n    if b:\n        |')
  expect(show(apply(stateOf('def f():\n    return 1|'), insertNewlineAndIndent))).toBe('def f():\n    return 1\n    |')
})

test('the live editor: labelled textbox, smart backspace over indentation, auto-closing brackets, wrapped lines with hanging indent', () => {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  const changes: string[] = []
  editor = createPythonEditor({ parent, doc: 'if x:\n        ', ariaLabel: 'Python code editor for expense_summary.py', describedBy: 'hint', onChange: (doc) => changes.push(doc), onRun: noop, onFocusChange: noop })
  const content = parent.querySelector('.cm-content')!
  expect(content.getAttribute('role')).toBe('textbox')
  expect(content.getAttribute('aria-label')).toBe('Python code editor for expense_summary.py')
  expect(content.getAttribute('aria-describedby')).toBe('hint')
  expect(content.getAttribute('autocapitalize')).toBe('off')
  expect(parent.querySelector('.cm-lineWrapping')).toBeTruthy()

  // Backspace in leading whitespace removes a whole indent level.
  const view = editor.view
  view.dispatch({ selection: { anchor: view.state.doc.length } })
  deleteCharBackward(view)
  expect(view.state.doc.toString()).toBe('if x:\n    ')
  expect(changes.at(-1)).toBe('if x:\n    ')

  // Typing "(" inserts the closing bracket too (closeBrackets input handler).
  view.dispatch({ selection: { anchor: view.state.doc.length } })
  const handled = view.state.facet(EditorView.inputHandler).some((handler) => handler(view, view.state.doc.length, view.state.doc.length, '(', () => view.state.update({ changes: { from: view.state.doc.length, insert: '(' } })))
  expect(handled).toBe(true)
  expect(view.state.doc.toString()).toBe('if x:\n    ()')

  // Reset is one undoable change.
  editor.setDoc(DEFAULT_PYTHON_CODE)
  expect(editor.getDoc()).toBe(DEFAULT_PYTHON_CODE)
  undo(view)
  expect(editor.getDoc()).toBe('if x:\n    ()')

  // Lines carry the same hanging-indent variable as the server-rendered copy.
  editor.setDoc(DEFAULT_PYTHON_CODE)
  const lines = parent.querySelectorAll<HTMLElement>('.cm-line')
  expect(lines[0].style.getPropertyValue('--hang')).toBe('4ch')
  expect(lines[11].style.getPropertyValue('--hang')).toBe('8ch')
})

test('the server-rendered code and the live editor paint identical token classes, line by line', () => {
  const { container } = render(<PythonCodeStatic code={DEFAULT_PYTHON_CODE} />)
  const staticLines = Array.from(container.querySelectorAll('.home-code-line')).map((line) =>
    Array.from(line.querySelectorAll('span')).map((span) => `${span.className}:${span.textContent}`).join(' '),
  )
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  editor = createPythonEditor({ parent, doc: DEFAULT_PYTHON_CODE, ariaLabel: 'Python', onChange: noop, onRun: noop, onFocusChange: noop })
  const liveLines = Array.from(parent.querySelectorAll('.cm-line')).map((line) =>
    Array.from(line.querySelectorAll('span[class*="home-tok-"]')).map((span) => `${span.className}:${span.textContent}`).join(' '),
  )
  expect(liveLines).toEqual(staticLines)
  expect(staticLines[10]).toBe('home-tok-k:for home-tok-k:in home-tok-f:items')
})

test('hanging indent: one level deeper than the line, capped for deeply nested code', () => {
  expect(hangingIndentCh('total = 1')).toBe(4)
  expect(hangingIndentCh('    print(x)')).toBe(8)
  expect(hangingIndentCh('\tprint(x)')).toBe(8)
  expect(hangingIndentCh(' '.repeat(40) + 'x')).toBe(16)
  expect(highlightPythonLines('a\n\nb')).toHaveLength(3)
})
