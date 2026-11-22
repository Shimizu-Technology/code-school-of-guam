import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import fs from 'node:fs'
import path from 'node:path'
import { HeroEditor, DEFAULT_PYTHON_CODE, EDITOR_LINES, EDITOR_OUTPUT, RUN_EXECUTION_TIMEOUT_MS } from '../components/home/hero-editor'
import { buildHafaCodePythonUrl } from '../lib/hafa-code-link'
import { StoryDeck } from '../components/home/story-deck'
import { CapstoneClip, CAPSTONE_CLIP } from '../components/home/capstone-clip'
import { LearningRoute } from '../components/home/learning-route'
import { OpeningPhoto } from '../components/home/opening-photo'

vi.mock('next/image', () => ({ default: ({ fill: _fill, quality: _quality, ...props }: Record<string, unknown>) => <img alt="" {...props} /> }))

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

test('hero editor renders complete beginner program and output immediately without creating a worker on mount', () => {
  reducedMotion()
  MockPythonWorker.instances = []
  vi.stubGlobal('Worker', MockPythonWorker)
  const { container } = render(<HeroEditor />)
  const code = container.querySelector('.home-code')!.textContent!
  expect(code).toContain('for item, cost in expenses.items():')
  expect(container.querySelectorAll('.home-ln')).toHaveLength(EDITOR_LINES.length)
  for (const line of EDITOR_OUTPUT) expect(container.querySelector('.home-term')!.textContent).toContain(line)
  expect(MockPythonWorker.instances).toHaveLength(0)
  expect(screen.getByRole('button', { name: 'Run the Python example in your browser' })).toBeTruthy()
  expect(screen.getByRole('button', { name: /Write your own/ })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Python Fundamentals' }).getAttribute('href')).toBe('/courses/python-fundamentals')
  expect(screen.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')).toContain('https://code.shimizu-technology.com/?lang=python#project=')
})

test('hero editor runs Python in a Web Worker on click, supports Write your own, Reset, timeout, and output cap', () => {
  reducedMotion()
  vi.useFakeTimers()
  try {
    MockPythonWorker.instances = []
    vi.stubGlobal('Worker', MockPythonWorker)
    const { container } = render(<HeroEditor />)

    // Clicking Run spawns the static worker on demand.
    fireEvent.click(screen.getByRole('button', { name: 'Run the Python example in your browser' }))
    expect(MockPythonWorker.instances).toHaveLength(1)
    const worker = MockPythonWorker.instances[0]
    expect(worker.url).toBe('/workers/python-runner.js')
    const runMsg = worker.posted[0] as { id: string; type: string; code: string }
    expect(runMsg.type).toBe('run')
    expect(runMsg.code).toBe(DEFAULT_PYTHON_CODE)
    expect(container.querySelector('.home-term')!.textContent).toContain('Loading Python')

    act(() => {
      worker.emit({ id: runMsg.id, type: 'started' })
      worker.emit({ id: runMsg.id, type: 'result', stdout: 'Total: $118\nUnder budget by $2\n', stderr: '', exitCode: 0 })
    })
    expect(container.querySelector('.home-term')!.textContent).toContain('Ran in browser')
    expect(container.querySelector('.home-term')!.textContent).toContain('Under budget by $2')

    // Write your own switches to an editable textarea and updates the Hafa Code link.
    fireEvent.click(screen.getByRole('button', { name: /Write your own/ }))
    const textarea = screen.getByRole('textbox', { name: /Python code editor/ }) as HTMLTextAreaElement
    fireEvent.change(textarea, { target: { value: 'print(6 * 7)' } })
    const hafaHref = screen.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')!
    const encoded = hafaHref.split('#project=')[1]
    const decoded = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
    expect(decoded.kind).toBe('python')
    expect(decoded.files[0].content).toBe('print(6 * 7)')

    // Running edited code and hitting 5s timeout terminates the worker cleanly.
    fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
    const run2 = worker.posted[1] as { id: string; code: string }
    expect(run2.code).toBe('print(6 * 7)')
    act(() => { worker.emit({ id: run2.id, type: 'started' }) })
    act(() => { vi.advanceTimersByTime(RUN_EXECUTION_TIMEOUT_MS) })
    expect(worker.terminated).toBe(true)
    expect(container.querySelector('.home-term')!.textContent).toContain('Stopped after 5 seconds')

    // Output-limit message terminates the next worker and displays the cap notice.
    fireEvent.click(screen.getByRole('button', { name: 'Run your Python code' }))
    const worker2 = MockPythonWorker.instances[1]
    const run3 = worker2.posted[0] as { id: string }
    act(() => {
      worker2.emit({ id: run3.id, type: 'output_limit', stdout: 'spam\n', stderr: '', message: 'Output stopped after 200 lines.' })
    })
    expect(worker2.terminated).toBe(true)
    expect(container.querySelector('.home-term')!.textContent).toContain('Output stopped after 200 lines.')

    // Reset restores the original expense_summary.py code and sample output.
    fireEvent.click(screen.getByRole('button', { name: 'Reset to default Python example' }))
    expect(textarea.value).toBe(DEFAULT_PYTHON_CODE)
    expect(container.querySelector('.home-term')!.textContent).toContain('Food: $61')
  } finally {
    vi.useRealTimers()
  }
})

test('buildHafaCodePythonUrl encodes UTF-8 Python code in Hafa Code project link format', () => {
  const url = buildHafaCodePythonUrl('print("Håfa Adai!")\n', { title: 'Greeting', filename: 'main.py' })
  expect(url.startsWith('https://code.shimizu-technology.com/?lang=python#project=')).toBe(true)
  const payload = JSON.parse(Buffer.from(url.split('#project=')[1], 'base64url').toString('utf8'))
  expect(payload).toEqual({
    title: 'Greeting',
    kind: 'python',
    entryPath: 'main.py',
    files: [{ path: 'main.py', content: 'print("Håfa Adai!")\n' }],
  })
})

test('editor lines fit a phone: no line is longer than 38 characters', () => {
  for (const line of EDITOR_LINES) expect(line.map(([, text]) => text).join('').length).toBeLessThanOrEqual(38)
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
