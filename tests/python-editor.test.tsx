import { afterEach, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { EditorSelection, EditorState, type Transaction } from '@codemirror/state'
import { deleteCharBackward, insertNewlineAndIndent, undo } from '@codemirror/commands'
import { EditorView } from '@codemirror/view'
import { accessoryCommands, createPythonEditor, pythonEditorExtensions, type PythonEditorHandle } from '../components/home/python-editor'
import { PythonCodeStatic } from '../components/home/python-code-static'
import { highlightPythonLines } from '../lib/python-highlight'
import { DEFAULT_PYTHON_CODE, CLEAR_PYTHON_CODE } from '../lib/python-sample'

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
  expect(show(apply(stateOf('\tx|'), accessoryCommands.tab))).toBe('\tx   |')
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

test('Enter after a colon adds an indent level; return keeps the current indentation', () => {
  expect(show(apply(stateOf('for x in y:|'), insertNewlineAndIndent))).toBe('for x in y:\n    |')
  expect(show(apply(stateOf('if a:\n    if b:|'), insertNewlineAndIndent))).toBe('if a:\n    if b:\n        |')
  expect(show(apply(stateOf('def f():\n    return 1|'), insertNewlineAndIndent))).toBe('def f():\n    return 1\n    |')
})

test('the live editor: labelled textbox, smart backspace over indentation, auto-closing brackets, unwrapped code lines', () => {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  const changes: string[] = []
  editor = createPythonEditor({ parent, doc: 'if x:\n        ', ariaLabel: 'Python code editor for expense_summary.py', describedBy: 'hint', onChange: (doc) => changes.push(doc), onRun: noop, onFocusChange: noop })
  const content = parent.querySelector('.cm-content')!
  expect(content.getAttribute('role')).toBe('textbox')
  expect(content.getAttribute('aria-label')).toBe('Python code editor for expense_summary.py')
  expect(content.getAttribute('aria-describedby')).toBe('hint')
  expect(content.getAttribute('autocapitalize')).toBe('off')
  expect(parent.querySelector('.cm-lineWrapping')).toBeNull()

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
  expect(staticLines.some(line => line.includes('home-tok-f:values'))).toBe(true)
})

test('the highlighter preserves blank source lines', () => {
  expect(highlightPythonLines('a\n\nb')).toHaveLength(3)
})


test('accessory pairs register their closers, and iOS smart quotes use the same bracket state', () => {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  editor = createPythonEditor({ parent, doc: 'print', ariaLabel: 'Python', onChange: noop, onRun: noop, onFocusChange: noop })
  const view = editor.view
  editor.placeCursorAtEnd()
  const type = (text: string) => {
    const { from, to } = view.state.selection.main
    const handled = view.state.facet(EditorView.inputHandler).some(handler => handler(view, from, to, text, () => view.state.update(view.state.replaceSelection(text))))
    if (!handled) view.dispatch(view.state.replaceSelection(text))
  }
  editor.runKey('parens')
  editor.runKey('quotes')
  type('Hi')
  type('”')
  type(')')
  expect(editor.getDoc()).toBe('print("Hi")')
  expect(view.state.selection.main.head).toBe(view.state.doc.length)
  editor.setDoc('')
  type('‘')
  type('Guam')
  type('’')
  expect(editor.getDoc()).toBe("'Guam'")
  editor.setDoc('')
  type('“')
  type('Hi')
  type('”')
  expect(editor.getDoc()).toBe('"Hi"')
})


test('Clear is one undoable replacement even immediately after typing, and the cursor can start on line two', () => {
  const parent = document.createElement('div')
  document.body.appendChild(parent)
  editor = createPythonEditor({ parent, doc: 'print("previous")', ariaLabel: 'Python', onChange: noop, onRun: noop, onFocusChange: noop })
  editor.placeCursorAtEnd()
  editor.insertAtCursor(' # my edit')
  const previous = editor.getDoc()
  editor.setDoc(CLEAR_PYTHON_CODE)
  editor.placeCursorAtEnd()
  expect(editor.getDoc()).toBe('# Write your Python here\n')
  expect(editor.view.state.doc.lineAt(editor.view.state.selection.main.head).number).toBe(2)
  editor.runKey('undo')
  expect(editor.getDoc()).toBe(previous)
})
