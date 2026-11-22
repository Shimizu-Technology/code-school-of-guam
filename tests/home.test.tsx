import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import fs from 'node:fs'
import path from 'node:path'
import {
  HeroEditor,
  DEFAULT_PYTHON_CODE as EXPENSE_CODE,
  EDITOR_OUTPUT,
  EDITOR_LINES,
  RUN_EXECUTION_TIMEOUT_MS,
  RUNTIME_LOAD_SAFETY_TIMEOUT_MS,
  RUNTIME_SLOW_HINT_MS,
  STOP_GUARD_MS,
} from '../components/home/hero-editor'
import { CLEAR_PYTHON_CODE, PYTHON_EXAMPLES } from '../lib/python-sample'
import { PythonCodeStatic } from '../components/home/python-code-static'
import type { PythonEditorOptions } from '../components/home/python-editor'
import { buildHafaCodePythonLink, buildHafaCodePythonUrl, MAX_ENCODED_URL_LENGTH } from '../lib/hafa-code-link'
import { StoryDeck } from '../components/home/story-deck'
import { CapstoneClip, CAPSTONE_CLIP } from '../components/home/capstone-clip'
import { LearningRoute } from '../components/home/learning-route'
import { OpeningPhoto } from '../components/home/opening-photo'

vi.mock('next/image', () => ({ default: ({ fill: _fill, quality: _quality, ...props }: Record<string, unknown>) => <img alt="" {...props} /> }))

// The real CodeMirror editor is covered in python-editor.test.tsx; here a textarea stands in
// for the lazily imported chunk so the runner, Reset and link flows stay fast and synchronous.
const editorSpy = vi.hoisted(() => ({ runKey: [] as string[], instances: 0 }))
vi.mock('../components/home/python-editor', () => ({
  createPythonEditor: (opts: PythonEditorOptions) => {
    editorSpy.instances += 1
    const ta = document.createElement('textarea')
    ta.setAttribute('aria-label', opts.ariaLabel)
    ta.value = opts.doc
    const sync = () => opts.onChange(ta.value)
    ta.addEventListener('input', sync)
    ta.addEventListener('change', sync)
    ta.addEventListener('focus', () => opts.onFocusChange(true))
    ta.addEventListener('blur', () => opts.onFocusChange(false))
    ta.addEventListener('keydown', (event) => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') opts.onRun() })
    opts.parent.appendChild(ta)
    return {
      view: { scrollDOM: { scrollTop: 0 } },
      getDoc: () => ta.value,
      setDoc: (doc: string) => { ta.value = doc; opts.onChange(doc) },
      focus: () => ta.focus(),
      blur: () => ta.blur(),
      placeCursorAt: () => {},
      placeCursorAtEnd: () => {},
      insertAtCursor: () => {},
      runKey: (key: string) => { editorSpy.runKey.push(key) },
      revealCursor: () => {},
      destroy: () => ta.remove(),
    }
  },
}))

const DEFAULT_PYTHON_CODE = PYTHON_EXAMPLES[1].code

function renderHero() {
  return render(<HeroEditor staticCode={<PythonCodeStatic code={DEFAULT_PYTHON_CODE} />} />)
}

/** Lets the lazily imported (mocked) editor module resolve and mount. */
async function editorLoaded() {
  await act(async () => {
    await import('../components/home/python-editor')
    for (let i = 0; i < 5; i++) await Promise.resolve()
  })
}

afterEach(async () => { cleanup(); await new Promise((resolve) => setTimeout(resolve, 0)); vi.unstubAllGlobals() })

function reducedMotion() {
  // Every query reports false, including (prefers-reduced-motion: no-preference).
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} unobserve() {} })
}

class MockPythonWorker {
  static instances: MockPythonWorker[] = []
  readonly url: string
  onmessage: ((event: MessageEvent) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  posted: unknown[] = []
  terminated = false

  constructor(url: string) {
    this.url = url
    MockPythonWorker.instances.push(this)
  }

  postMessage(data: unknown) {
    this.posted.push(data)
  }

  terminate() {
    this.terminated = true
  }

  emit(data: unknown) {
    this.onmessage?.({ data } as MessageEvent)
  }
}

test('hero editor reserves output space with highlighted weather code and no worker on mount', () => {
  reducedMotion()
  MockPythonWorker.instances = []
  vi.stubGlobal('Worker', MockPythonWorker)
  const { container } = renderHero()
  const code = container.querySelector('.home-code-static')!.textContent!
  expect(code).toContain('for month, mm in rain.items():')
  expect(container.querySelector('.home-code-static')!.hasAttribute('aria-label')).toBe(false)
  expect(screen.getByRole('region', { name: 'Sample Python code: guam_weather.py' }).tabIndex).toBe(0)
  expect(container.querySelector<HTMLElement>('.home-term')!.hidden).toBe(false)
  expect(container.querySelectorAll('.home-code-row')).toHaveLength(DEFAULT_PYTHON_CODE.split('\n').length)
  // Highlighted before any editor code loads: keywords, strings, numbers and calls all have colors.
  const classOf = (text: string) => Array.from(container.querySelectorAll('.home-code-static span[class^="home-tok-"]')).find((el) => el.textContent === text)?.className
  expect(classOf('for')).toBe('home-tok-k')
  expect(classOf('"Guam: sample data"')).toBe('home-tok-s')
  expect(classOf('77')).toBe('home-tok-n')
  expect(classOf('print')).toBe('home-tok-f')
  // Wrapped lines hang one indent deeper than their own indentation.
  const rows = container.querySelectorAll<HTMLElement>('.home-code-line')
  expect(rows[0].style.getPropertyValue('--hang')).toBe('4ch')
  expect(rows[10].style.getPropertyValue('--hang')).toBe('8ch')
  expect(editorSpy.instances).toBe(0)
  expect(container.querySelector('.home-term')!.textContent).not.toContain('Food: $61')
  expect(MockPythonWorker.instances).toHaveLength(0)
  expect(screen.getByRole('button', { name: 'Run the Python example in your browser' })).toBeTruthy()
  expect(screen.getByRole('button', { name: /Edit Python code/ })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Python Fundamentals' }).getAttribute('href')).toBe('/courses/python-fundamentals')
  const hafaHref = screen.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')!
  expect(hafaHref).toContain('https://code.shimizu-technology.com/?lang=python#project=')
  expect(hafaHref).toContain(`starter=${PYTHON_EXAMPLES[1].starterKey}`)
})

test('hero editor runs Python in a Web Worker on click, supports Edit Python code, Reset, timeout, and output cap', async () => {
  reducedMotion()
  vi.useFakeTimers()
  try {
    MockPythonWorker.instances = []
    vi.stubGlobal('Worker', MockPythonWorker)
    const { container } = renderHero()

    // Clicking Run spawns the static worker on demand and clears stale output.
    fireEvent.click(screen.getByRole('button', { name: 'Run the Python example in your browser' }))
    expect(MockPythonWorker.instances).toHaveLength(1)
    const worker = MockPythonWorker.instances[0]
    expect(worker.url).toBe('/workers/python-runner.js')
    const runMsg = worker.posted[0] as { id: string; type: string; code: string }
    expect(runMsg.type).toBe('run')
    expect(runMsg.code).toBe(DEFAULT_PYTHON_CODE)
    expect(container.querySelector('.home-term')!.textContent).toContain('Loading Python')
    expect(container.querySelector('.home-term')!.textContent).not.toContain('Food: $61')

    // Double-click / immediate click on swapped Stop button (< 400ms) is ignored so warm load is not killed.
    fireEvent.click(screen.getByRole('button', { name: 'Stop running Python' }))
    expect(worker.terminated).toBe(false)

    // Slow mobile load: past 25s it still does NOT terminate the worker; after 10s it shows a helpful hint.
    act(() => { vi.advanceTimersByTime(RUNTIME_SLOW_HINT_MS) })
    expect(worker.terminated).toBe(false)
    expect(container.querySelector('.home-term')!.textContent).toContain('Still loading Python (first time only)')
    act(() => { vi.advanceTimersByTime(20_000) })
    expect(worker.terminated).toBe(false)

    act(() => {
      worker.emit({ id: runMsg.id, type: 'started' })
      worker.emit({ id: runMsg.id, type: 'result', stdout: 'Total: $118\nUnder budget by $2\n', stderr: '', exitCode: 0 })
    })
    expect(container.querySelector('.home-term')!.textContent).toContain('Ran in browser')
    expect(container.querySelector('.home-term')!.textContent).toContain('Under budget by $2')

    // Edit Python code lazily loads the editor in place of the highlighted copy and updates the Hafa Code link.
    fireEvent.click(screen.getByRole('button', { name: /Edit Python code/ }))
    await editorLoaded()
    act(() => { vi.advanceTimersByTime(20) })
    expect(container.querySelector('.home-code-static')).toBeNull()
    const textarea = screen.getByRole('textbox', { name: /Python code editor/ }) as HTMLTextAreaElement
    expect(document.activeElement).toBe(textarea)
    expect(textarea.value).toBe(DEFAULT_PYTHON_CODE)
    fireEvent.change(textarea, { target: { value: 'print(6 * 7)' } })
    const hafaHref = screen.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')!
    const hashParams = new URLSearchParams(hafaHref.split('#')[1])
    const decoded = JSON.parse(Buffer.from(hashParams.get('project')!, 'base64url').toString('utf8'))
    expect(decoded.kind).toBe('python')
    expect(decoded.files[0].content).toBe('print(6 * 7)')
    expect(hashParams.get('starter')).toBe(PYTHON_EXAMPLES[1].starterKey)

    // Running edited code and hitting 5s timeout (after `started`) terminates the worker cleanly.
    fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
    const run2 = worker.posted[1] as { id: string; code: string }
    expect(run2.code).toBe('print(6 * 7)')
    act(() => { worker.emit({ id: run2.id, type: 'started' }) })
    act(() => { vi.advanceTimersByTime(RUN_EXECUTION_TIMEOUT_MS) })
    expect(worker.terminated).toBe(true)
    expect(container.querySelector('.home-term')!.textContent).toContain('Stopped after 5 seconds')
    expect(container.querySelector('.home-term')!.textContent).not.toContain('Under budget by $2')

    // Output-limit message terminates the next worker and displays the cap notice.
    fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
    const worker2 = MockPythonWorker.instances[1]
    const run3 = worker2.posted[0] as { id: string }
    act(() => {
      worker2.emit({ id: run3.id, type: 'output_limit', stdout: 'spam\n', stderr: '', message: 'Output stopped after 200 lines.' })
    })
    expect(worker2.terminated).toBe(true)
    expect(container.querySelector('.home-term')!.textContent).toContain('Output stopped after 200 lines.')

    // Stop after the 400ms guard terminates a running worker cleanly.
    fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
    const worker3 = MockPythonWorker.instances[2]
    act(() => { vi.advanceTimersByTime(STOP_GUARD_MS + 50) })
    fireEvent.click(screen.getByRole('button', { name: 'Stop running Python' }))
    expect(worker3.terminated).toBe(true)
    expect(container.querySelector('.home-term')!.textContent).toContain('Stopped.')

    // Reset ALWAYS terminates an idle warm worker (prevents poisoned builtins state) and moves focus to editor.
    fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
    const worker4 = MockPythonWorker.instances[3]
    const run4 = worker4.posted[0] as { id: string }
    act(() => {
      worker4.emit({ id: run4.id, type: 'started' })
      worker4.emit({ id: run4.id, type: 'result', stdout: '42\n', stderr: '', exitCode: 0 })
    })
    expect(worker4.terminated).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Reset to original Python example' }))
    expect(worker4.terminated).toBe(true)
    // Stale message from terminated worker is ignored.
    act(() => { worker4.emit({ id: run4.id, type: 'ready' }) })
    act(() => { vi.advanceTimersByTime(20) })
    expect(document.activeElement).toBe(textarea)
    expect(textarea.value).toBe(DEFAULT_PYTHON_CODE)
    expect(container.querySelector<HTMLElement>('.home-term')!.hidden).toBe(true)
  } finally {
    vi.useRealTimers()
  }
})

test('hero editor enforces the generous load safety cap and moves focus to Run after read-only Reset', () => {
  reducedMotion()
  vi.useFakeTimers()
  try {
    MockPythonWorker.instances = []
    vi.stubGlobal('Worker', MockPythonWorker)
    const { container } = renderHero()

    fireEvent.click(screen.getByRole('button', { name: 'Run the Python example in your browser' }))
    const worker = MockPythonWorker.instances[0]
    act(() => { vi.advanceTimersByTime(RUNTIME_LOAD_SAFETY_TIMEOUT_MS) })
    expect(worker.terminated).toBe(true)
    expect(container.querySelector('.home-term')!.textContent).toContain('Python took too long to load')

    // Complete a run in read-only mode, then click Reset and verify focus moves to Run (not body).
    fireEvent.click(screen.getByRole('button', { name: 'Run the Python example in your browser' }))
    const worker2 = MockPythonWorker.instances[1]
    const run2 = worker2.posted[0] as { id: string }
    act(() => {
      worker2.emit({ id: run2.id, type: 'started' })
      worker2.emit({ id: run2.id, type: 'result', stdout: 'ok\n', stderr: '', exitCode: 0 })
    })
    fireEvent.click(screen.getByRole('button', { name: 'Reset to original Python example' }))
    act(() => { vi.advanceTimersByTime(20) })
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Run the Python example in your browser' }))
  } finally {
    vi.useRealTimers()
  }
})

test('buildHafaCodePythonLink handles below-cap payloads and oversized fallback with copy notice in HeroEditor', async () => {
  const url = buildHafaCodePythonUrl('print("Håfa Adai!")\n', {
    title: 'Greeting',
    filename: 'main.py',
    starterKey: 'csg-site-greeting',
  })
  expect(url.startsWith('https://code.shimizu-technology.com/?lang=python#project=')).toBe(true)
  const hashParams = new URLSearchParams(url.split('#')[1])
  const payload = JSON.parse(Buffer.from(hashParams.get('project')!, 'base64url').toString('utf8'))
  expect(payload).toEqual({
    title: 'Greeting',
    kind: 'python',
    entryPath: 'main.py',
    files: [{ path: 'main.py', content: 'print("Håfa Adai!")\n' }],
  })
  expect(hashParams.get('starter')).toBe('csg-site-greeting')

  const mediumCode = 'x = 1\n'.repeat(1600) // ~9,600 chars, under 64,000 URL cap
  const mediumLink = buildHafaCodePythonLink(mediumCode, { starterKey: 'csg-medium' })
  expect(mediumLink.truncated).toBe(false)
  expect(mediumLink.url).toContain('#project=')
  expect(mediumLink.url.length).toBeLessThanOrEqual(MAX_ENCODED_URL_LENGTH)

  const hugeCode = 'x = 1234567890\n'.repeat(4000) // ~60,000 chars -> base64 > 64,000 cap
  const hugeLink = buildHafaCodePythonLink(hugeCode, { starterKey: 'csg-huge' })
  expect(hugeLink.truncated).toBe(true)
  expect(hugeLink.url).toBe('https://code.shimizu-technology.com/?lang=python')

  // HeroEditor surfaces a clear notice and Copy button when code exceeds the link cap.
  reducedMotion()
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
  vi.stubGlobal('Worker', MockPythonWorker)
  renderHero()
  fireEvent.click(screen.getByRole('button', { name: /Edit Python code/ }))
  await editorLoaded()
  const textarea = screen.getByRole('textbox', { name: /Python code editor/ })
  fireEvent.change(textarea, { target: { value: hugeCode } })
  expect(screen.getByRole('note').textContent).toContain('too large to preload in a link')
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Copy code/ }))
  })
  expect(writeText).toHaveBeenCalledWith(hugeCode)
  expect(screen.getByRole('button', { name: /Copied/ })).toBeTruthy()
})

test('python-runner worker keeps short tracebacks intact and enforces the output cap on oversized exceptions', async () => {
  const workerSrc = fs.readFileSync(path.join('public', 'workers', 'python-runner.js'), 'utf8')
  let nextError: Error | null = null
  const posted: Array<Record<string, unknown>> = []
  const fakeSelf: Record<string, unknown> = {
    importScripts: () => {},
    loadPyodide: async () => ({
      setStdout: () => {},
      setStderr: () => {},
      setStdin: () => {},
      globals: { set: () => {}, delete: () => {} },
      runPython: () => {},
      runPythonAsync: async () => {
        if (nextError) throw nextError
      },
    }),
    postMessage: (msg: Record<string, unknown>) => posted.push(msg),
    onmessage: null,
  }
  new Function('self', workerSrc)(fakeSelf)
  const onmessage = fakeSelf.onmessage as (event: { data: Record<string, unknown> }) => Promise<void>

  // Short traceback stays intact with exitCode 1.
  nextError = new Error('Traceback (most recent call last):\n  File "expense_summary.py", line 1, in <module>\nZeroDivisionError: division by zero')
  await onmessage({ data: { id: 'r1', type: 'run', code: '1 / 0', filename: 'expense_summary.py' } })
  const shortResult = posted.find((m) => m.id === 'r1' && m.type === 'result')!
  expect(shortResult).toBeTruthy()
  expect(shortResult.exitCode).toBe(1)
  expect(String(shortResult.stderr)).toContain('ZeroDivisionError: division by zero')

  // Oversized exception message is capped through the 8 KB / 200-line budget.
  nextError = new Error('ValueError: ' + 'x'.repeat(20_000))
  await onmessage({ data: { id: 'r2', type: 'run', code: 'raise ValueError("x"*20000)', filename: 'expense_summary.py' } })
  const capped = posted.find((m) => m.id === 'r2' && m.type === 'output_limit')!
  expect(capped).toBeTruthy()
  expect(String(capped.stderr).length).toBeLessThanOrEqual(8192)
  expect(String(capped.message)).toContain('200 lines / 8 KB')
})

test('editor lines stay short: no sample line is longer than 38 characters', () => {
  for (const line of EDITOR_LINES) expect(line.length).toBeLessThanOrEqual(38)
})

test('tapping the highlighted code loads the editor; Cmd/Ctrl+Enter runs and touch screens get coding keys with Run', async () => {
  // Touch screen: (pointer: coarse) matches; everything else (including reduced motion) does not.
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: query === '(pointer: coarse)', addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  MockPythonWorker.instances = []
  editorSpy.runKey = []
  vi.stubGlobal('Worker', MockPythonWorker)
  const { container } = renderHero()
  fireEvent.click(screen.getByRole('region', { name: 'Sample Python code: guam_weather.py' }), { clientX: 40, clientY: 40 })
  // iOS needs focus inside the tap to raise the keyboard; an invisible holder takes it until the editor mounts.
  expect(document.activeElement?.classList.contains('home-focus-proxy')).toBe(true)
  await editorLoaded()
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 30)) })
  expect(container.querySelector('.home-focus-proxy')).toBeNull()
  const textarea = screen.getByRole('textbox', { name: /Python code editor/ })
  expect(document.activeElement).toBe(textarea)

  const keys = screen.getByRole('toolbar', { name: 'Coding keys' })
  expect(Array.from(keys.querySelectorAll('.home-key')).map(key => key.getAttribute('aria-label'))).toEqual(['Indent (Tab)', 'Insert colon', 'Insert parentheses', 'Insert quotes', 'Insert equals sign', 'Undo', 'Insert square brackets', 'Insert curly braces', 'Insert hash (comment)', 'Move cursor left', 'Move cursor right'])
  for (const name of ['Indent (Tab)', 'Insert colon', 'Insert parentheses', 'Insert square brackets', 'Insert curly braces', 'Insert quotes', 'Insert equals sign', 'Insert hash (comment)', 'Move cursor left', 'Move cursor right', 'Undo']) {
    fireEvent.click(within(keys).getByRole('button', { name }))
  }
  expect(editorSpy.runKey).toEqual(['tab', 'colon', 'parens', 'brackets', 'braces', 'quotes', 'equals', 'hash', 'left', 'right', 'undo'])
  // Key presses never take focus from the editor (the keyboard stays open).
  const pointerDown = new Event('pointerdown', { bubbles: true, cancelable: true })
  within(keys).getByRole('button', { name: 'Insert colon' }).dispatchEvent(pointerDown)
  expect(pointerDown.defaultPrevented).toBe(true)

  fireEvent.click(within(keys).getByRole('button', { name: 'Run your Python code' }))
  expect(MockPythonWorker.instances.at(-1)!.posted.at(-1)).toMatchObject({ type: 'run', code: DEFAULT_PYTHON_CODE })
  expect(screen.getByRole('status', { name: '' }).textContent).toMatch(/Loading Python|Running/)

  // Cmd/Ctrl+Enter from the editor runs too (ignored while a run is already active).
  const worker = MockPythonWorker.instances.at(-1)!
  const run = worker.posted.at(-1) as { id: string }
  act(() => {
    worker.emit({ id: run.id, type: 'started' })
    worker.emit({ id: run.id, type: 'result', stdout: 'ok\n', stderr: '', exitCode: 0 })
  })
  fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true })
  expect(worker.posted.filter((m) => (m as { type: string }).type === 'run')).toHaveLength(2)
})

test('the hero editor client component keeps CodeMirror and the highlighter out of first-load JavaScript', () => {
  const source = fs.readFileSync(path.join('components', 'home', 'hero-editor.tsx'), 'utf8')
  const staticImports = source.match(/^import (?!type ).*$/gm) ?? []
  for (const line of staticImports) expect(line).not.toMatch(/@codemirror|@lezer|python-highlight|python-editor/)
  expect(source).toContain('import("./python-editor")')
})

test('the sample output matches what the program prints', () => {
  const expenses = { Food: 61, Transport: 48, Supplies: 9 }
  const total = Object.values(expenses).reduce((a, b) => a + b, 0)
  expect(EDITOR_OUTPUT).toEqual([`Total: $${total}`, ...Object.entries(expenses).map(([k, v]) => `${k}: $${v}`), `Under budget by $${120 - total}`])
})

test('the story deck shows one story at a time and Next moves to the following graduate', () => {
  reducedMotion()
  const { container } = render(<StoryDeck />)
  const visible = () => Array.from(container.querySelectorAll('.home-qcard')).filter((card) => card.getAttribute('aria-hidden') !== 'true')
  expect(visible()).toHaveLength(1)
  expect(visible()[0].textContent).toContain('Noah Peredo')
  expect(screen.getByText('Story 1 of 3')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Next story/ }))
  expect(visible()[0].textContent).toContain('Jessica Fernandez')
  expect(screen.getByText('Story 2 of 3')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Next story/ }))
  fireEvent.click(screen.getByRole('button', { name: /Next story/ }))
  expect(visible()[0].textContent).toContain('Noah Peredo')
  for (const img of container.querySelectorAll('img')) expect(fs.existsSync(path.join('public', img.getAttribute('src')!))).toBe(true)
})

test('the capstone clip is silent, inline, metadata-preloaded with an underlying poster image, and with reduced motion waits for the visitor to press Play', async () => {
  reducedMotion()
  const play = vi.fn(() => Promise.resolve())
  const pause = vi.fn()
  Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: play })
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: pause })
  const { container } = render(<CapstoneClip />)
  const video = container.querySelector('video')!
  expect(video.muted).toBe(true)
  expect(video.loop).toBe(true)
  expect(video.hasAttribute('playsinline')).toBe(true)
  expect(video.getAttribute('preload')).toBe('metadata')
  expect(video.hasAttribute('poster')).toBe(false)
  expect(container.querySelector('img.home-live-poster')?.getAttribute('src')).toBe(CAPSTONE_CLIP.poster)
  expect(play).not.toHaveBeenCalled()
  const toggle = screen.getByRole('button', { name: 'Play capstone clip' })
  expect(toggle.getAttribute('aria-controls')).toBe(video.id)
  await act(async () => { fireEvent.click(toggle) })
  expect(play).toHaveBeenCalledTimes(1)
  for (const file of [CAPSTONE_CLIP.src, CAPSTONE_CLIP.poster]) expect(fs.existsSync(path.join('public', file))).toBe(true)
})

test('the capstone clip keeps data-ready false until loadeddata fires', () => {
  reducedMotion()
  const { container } = render(<CapstoneClip />)
  const video = container.querySelector('video')!
  expect(video.getAttribute('data-ready')).toBe('false')
  fireEvent(video, new Event('loadeddata'))
  expect(video.getAttribute('data-ready')).toBe('true')
})

test('the capstone clip marks data-ready true when playing fires', () => {
  reducedMotion()
  const { container } = render(<CapstoneClip />)
  const video = container.querySelector('video')!
  expect(video.getAttribute('data-ready')).toBe('false')
  fireEvent(video, new Event('playing'))
  expect(video.getAttribute('data-ready')).toBe('true')
})

test('the capstone clip marks data-ready true immediately when readyState is already >= 2', () => {
  reducedMotion()
  const orig = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'readyState')
  Object.defineProperty(HTMLMediaElement.prototype, 'readyState', { configurable: true, get: () => 2 })
  try {
    const { container } = render(<CapstoneClip />)
    const video = container.querySelector('video')!
    expect(video.getAttribute('data-ready')).toBe('true')
  } finally {
    if (orig) Object.defineProperty(HTMLMediaElement.prototype, 'readyState', orig)
    else delete (HTMLMediaElement.prototype as unknown as Record<string, unknown>).readyState
  }
})

// matchMedia whose answers can change while a component is mounted.
function liveMedia(initial: Record<string, boolean>) {
  const state = { ...initial }
  const listeners = new Map<string, Set<() => void>>()
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
    get matches() { return !!state[query] },
    addEventListener: (_: string, fn: () => void) => { if (!listeners.has(query)) listeners.set(query, new Set()); listeners.get(query)!.add(fn) },
    removeEventListener: (_: string, fn: () => void) => { listeners.get(query)?.delete(fn) },
  })))
  return (query: string, value: boolean) => act(() => { state[query] = value; listeners.get(query)?.forEach((fn) => fn()) })
}

const NO_PREFERENCE = '(prefers-reduced-motion: no-preference)'
const TALL = '(min-height: 640px)'
const frames = () => act(() => new Promise((resolve) => setTimeout(resolve, 120)))

test('a cancelled drag (browser takes over the scroll) keeps the current story', () => {
  reducedMotion()
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { configurable: true, value: () => {} })
  const { container } = render(<StoryDeck />)
  const top = () => container.querySelector('.home-qcard[data-top]')!
  fireEvent.pointerDown(top(), { pointerId: 1, clientX: 100, pointerType: 'touch' })
  fireEvent.pointerMove(top(), { pointerId: 1, clientX: 220, pointerType: 'touch' })
  fireEvent.pointerCancel(top(), { pointerId: 1, clientX: 220, pointerType: 'touch' })
  expect(screen.getByText('Story 1 of 3')).toBeTruthy()
  expect(top().textContent).toContain('Noah Peredo')
  // The same flick completed with pointerup does advance.
  fireEvent.pointerDown(top(), { pointerId: 2, clientX: 100, pointerType: 'touch' })
  fireEvent.pointerMove(top(), { pointerId: 2, clientX: 220, pointerType: 'touch' })
  fireEvent.pointerUp(top(), { pointerId: 2, clientX: 220, pointerType: 'touch' })
  expect(screen.getByText('Story 2 of 3')).toBeTruthy()
})

test('the learning route recomputes progress when the viewport resizes without a scroll', async () => {
  liveMedia({ [NO_PREFERENCE]: true })
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} unobserve() {} })
  Object.defineProperty(SVGElement.prototype, 'getTotalLength', { configurable: true, value: () => 1000 })
  Object.defineProperty(SVGElement.prototype, 'getPointAtLength', { configurable: true, value: (l: number) => ({ x: 0, y: l }) })
  const rect = { top: 600, height: 1000 }
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({ top: rect.top, bottom: rect.top + rect.height, height: rect.height, left: 0, right: 0, width: 0, x: 0, y: 0, toJSON() {} }) as DOMRect)
  vi.stubGlobal('innerHeight', 800)
  const { container } = render(<LearningRoute />)
  const draw = container.querySelector('.home-route-draw') as SVGPathElement
  await frames()
  // 0.7 * 800 = 560 < 600: the route has not started drawing.
  expect(Number(draw.style.strokeDashoffset)).toBe(1000)
  // A taller viewport (e.g. the phone address bar collapsing) moves the start line past the route.
  vi.stubGlobal('innerHeight', 1400)
  act(() => { window.dispatchEvent(new Event('resize')) })
  await frames()
  expect(Number(draw.style.strokeDashoffset)).toBeLessThan(1000)
})

test('the opening photo animates only on tall screens with motion allowed, and fully resets when motion turns off', async () => {
  const set = liveMedia({ [NO_PREFERENCE]: true, [TALL]: false })
  const added: string[] = []
  const removed: string[] = []
  const add = window.addEventListener.bind(window)
  const remove = window.removeEventListener.bind(window)
  vi.spyOn(window, 'addEventListener').mockImplementation((type: string, ...rest: unknown[]) => { added.push(type); return (add as (...a: unknown[]) => void)(type, ...rest) })
  vi.spyOn(window, 'removeEventListener').mockImplementation((type: string, ...rest: unknown[]) => { removed.push(type); return (remove as (...a: unknown[]) => void)(type, ...rest) })
  const cancel = vi.spyOn(window, 'cancelAnimationFrame')
  const { container } = render(<OpeningPhoto />)
  const section = container.querySelector('#teaching') as HTMLElement
  // Below 640px tall: still layout, no listeners.
  expect(section.hasAttribute('data-motion')).toBe(false)
  expect(added).not.toContain('scroll')
  set(TALL, true)
  await frames()
  expect(section.hasAttribute('data-motion')).toBe(true)
  expect(section.style.getPropertyValue('--p')).not.toBe('')
  expect(added).toEqual(expect.arrayContaining(['scroll', 'resize']))
  // The visitor turns on reduced motion while the page is open.
  set(NO_PREFERENCE, false)
  expect(section.hasAttribute('data-motion')).toBe(false)
  expect(section.style.getPropertyValue('--p')).toBe('')
  expect(removed).toEqual(expect.arrayContaining(['scroll', 'resize']))
  expect(cancel).toHaveBeenCalled()
})


test('sliding between coding keys does not insert the neighboring key', async () => {
  liveMedia({ '(pointer: coarse)': true })
  vi.stubGlobal('Worker', MockPythonWorker)
  renderHero()
  fireEvent.click(screen.getByRole('button', { name: 'Edit Python code' }))
  await editorLoaded()
  editorSpy.runKey = []
  const keys = screen.getByRole('toolbar', { name: 'Coding keys' })
  const colon = within(keys).getByRole('button', { name: 'Insert colon' })
  const pair = within(keys).getByRole('button', { name: 'Insert parentheses' })
  fireEvent.pointerDown(colon, { pointerId: 1, clientX: 20, clientY: 20 })
  fireEvent.pointerUp(pair, { pointerId: 1, clientX: 23, clientY: 20 })
  fireEvent.click(pair)
  expect(editorSpy.runKey).toEqual([])
})


test('Clear loads the editor, focuses it, and Reset restores the selected example', async () => {
  reducedMotion()
  vi.stubGlobal('Worker', MockPythonWorker)
  renderHero()
  fireEvent.click(screen.getByRole('button', { name: 'Clear Python editor' }))
  await editorLoaded()
  const textbox = screen.getByRole('textbox', { name: /Python code editor/ }) as HTMLTextAreaElement
  expect(textbox.value).toBe(CLEAR_PYTHON_CODE)
  expect(document.activeElement).toBe(textbox)
  fireEvent.click(screen.getByRole('button', { name: 'Reset to original Python example' }))
  expect(textbox.value).toBe(DEFAULT_PYTHON_CODE)
})

test('every example updates its code, caption, worker filename, and Hafa Code payload; switching clears output', async () => {
  reducedMotion()
  vi.stubGlobal('Worker', MockPythonWorker)
  const { container } = renderHero()
  for (const example of PYTHON_EXAMPLES) {
    fireEvent.click(screen.getByRole('combobox', { name: /^Python example(?: \(modified\))?$/ }))
    fireEvent.click(screen.getByRole('option', { name: example.filename }))
    await editorLoaded()
    const params = new URLSearchParams(screen.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')!.split('#')[1])
    const project = JSON.parse(Buffer.from(params.get('project')!, 'base64url').toString())
    expect(params.get('starter')).toBe(example.starterKey)
    expect(project).toMatchObject({ title: example.title, entryPath: example.filename, files: [{ path: example.filename, content: example.code }] })
    expect(container.querySelector('.home-example-caption')!.textContent).toBe(example.caption)
    expect(container.querySelector<HTMLElement>('.home-term')!.hidden).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /Run (your Python code|the Python example in your browser)/ }))
    const worker = MockPythonWorker.instances.at(-1)!
    const run = worker.posted.at(-1) as { id: string }
    expect(run).toMatchObject({ type: 'run', filename: example.filename, code: example.code })
    act(() => worker.emit({ id: run.id, type: 'result', stdout: example.lastOutput, exitCode: 0 }))
    expect(container.querySelector<HTMLElement>('.home-term')!.hidden).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Clear Python editor' }))
    await editorLoaded()
    fireEvent.click(screen.getByRole('button', { name: 'Reset to original Python example' }))
    expect((screen.getByRole('textbox', { name: /Python code editor/ }) as HTMLTextAreaElement).value).toBe(example.code)
  }
})

test('examples have distinct starters and compact, noninteractive programs; the original is unchanged', () => {
  expect(new Set(PYTHON_EXAMPLES.map(example => example.starterKey)).size).toBe(7)
  expect(PYTHON_EXAMPLES[0].code).toBe(EXPENSE_CODE)
  for (const example of PYTHON_EXAMPLES.slice(1)) {
    expect(example.code.split('\n').length).toBeLessThanOrEqual(14)
    expect(example.code).not.toContain('input(')
    expect(example.code.split('\n').every(line => line.length <= 32)).toBe(true)
  }
  const chamorro = PYTHON_EXAMPLES.find(example => example.filename === 'chamorro_hello.py')!.code
  expect(chamorro).toContain('Håfa adai')
  expect(chamorro).toContain("Si Yu'os ma'åse'")
})

test('Clear followed immediately by Run posts the pending cleared code', async () => {
  reducedMotion()
  MockPythonWorker.instances = []
  vi.stubGlobal('Worker', MockPythonWorker)
  renderHero()
  fireEvent.click(screen.getByRole('button', { name: 'Clear Python editor' }))
  fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
  expect(MockPythonWorker.instances.at(-1)!.posted.find(message => (message as { type: string }).type === 'run')).toMatchObject({ code: CLEAR_PYTHON_CODE })
  await editorLoaded()
})

test('Clear updates the pending document and Hafa link immediately; Run snapshots buffered input without consuming it', async () => {
  liveMedia({ '(pointer: coarse)': true })
  MockPythonWorker.instances = []
  vi.stubGlobal('Worker', MockPythonWorker)
  const { container } = renderHero()
  fireEvent.click(screen.getByRole('button', { name: 'Clear Python editor' }))
  expect(screen.getByRole('combobox', { name: 'Python example (modified)' })).toBeTruthy()
  const link = screen.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')!
  const project = JSON.parse(Buffer.from(new URLSearchParams(link.split('#')[1]).get('project')!, 'base64url').toString())
  expect(project.files[0].content).toBe(CLEAR_PYTHON_CODE)
  expect(container.querySelector('.home-code-fallback')!.textContent).toBe(CLEAR_PYTHON_CODE)
  const proxy = container.querySelector<HTMLTextAreaElement>('.home-focus-proxy')!
  proxy.value = 'print("hello")'
  fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
  const run = MockPythonWorker.instances.at(-1)!.posted.find(message => (message as { type: string }).type === 'run')
  expect(run).toMatchObject({ code: CLEAR_PYTHON_CODE + 'print("hello")' })
  expect(proxy.value).toBe('print("hello")')
  await editorLoaded()
})
