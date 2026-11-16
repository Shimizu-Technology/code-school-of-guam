import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import fs from 'node:fs'
import path from 'node:path'
import { HeroEditor, EDITOR_LINES, EDITOR_OUTPUT } from '../components/home/hero-editor'
import { StoryDeck } from '../components/home/story-deck'
import { CapstoneClip, CAPSTONE_CLIP } from '../components/home/capstone-clip'

vi.mock('next/image', () => ({ default: (props: Record<string, unknown>) => <img alt="" {...props} /> }))

afterEach(async () => { cleanup(); await new Promise((resolve) => setTimeout(resolve, 0)); vi.unstubAllGlobals() })

function reducedMotion() {
  // Every query reports false, including (prefers-reduced-motion: no-preference).
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  vi.stubGlobal('IntersectionObserver', class { observe() {} disconnect() {} unobserve() {} })
}

test('with reduced motion the editor shows the complete beginner program and its output', () => {
  reducedMotion()
  const { container } = render(<HeroEditor />)
  const code = container.querySelector('.home-code')!.textContent!
  expect(code).toContain('for item, cost in expenses.items():')
  expect(container.querySelectorAll('.home-ln')).toHaveLength(EDITOR_LINES.length)
  expect(container.querySelector('.home-caret')).toBeNull()
  for (const line of EDITOR_OUTPUT) expect(container.querySelector('.home-term')!.textContent).toContain(line)
  expect(screen.getByRole('button', { name: 'Run the sample program again' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Python Fundamentals' }).getAttribute('href')).toBe('/courses/python-fundamentals')
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

test('the capstone clip is silent, inline, lazy, and with reduced motion waits for the visitor to press Play', async () => {
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
  expect(video.getAttribute('preload')).toBe('none')
  expect(video.getAttribute('poster')).toBe(CAPSTONE_CLIP.poster)
  expect(play).not.toHaveBeenCalled()
  const toggle = screen.getByRole('button', { name: 'Play capstone clip' })
  expect(toggle.getAttribute('aria-controls')).toBe(video.id)
  await act(async () => { fireEvent.click(toggle) })
  expect(play).toHaveBeenCalledTimes(1)
  for (const file of [CAPSTONE_CLIP.src, CAPSTONE_CLIP.poster]) expect(fs.existsSync(path.join('public', file))).toBe(true)
})
