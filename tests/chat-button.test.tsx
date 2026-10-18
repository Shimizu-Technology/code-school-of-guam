import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'

vi.mock('next/dynamic', () => ({ default: () => () => <div role="dialog" aria-label="CSG Assistant" /> }))

import { ChatButton } from '../components/chat-button'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

test('the launcher stays mounted, fades in after scrolling, and has no attention pulse', () => {
  Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 })
  const { container } = render(<ChatButton />)
  const launcher = screen.getByRole('button', { hidden: true, name: 'Open chat' })
  expect(launcher.getAttribute('data-visible')).toBe('false')
  expect(launcher.className).toContain('invisible')
  expect(launcher.className).not.toContain('transition-all')
  expect(container.querySelector('.animate-ping')).toBeNull()

  Object.defineProperty(window, 'scrollY', { configurable: true, value: 900 })
  fireEvent.scroll(window)
  expect(launcher.getAttribute('data-visible')).toBe('true')
  expect(launcher.className).toContain('opacity-100')
  expect(launcher.className).toContain('active:scale-[0.97]')

  fireEvent.click(launcher)
  expect(screen.getByRole('dialog', { name: 'CSG Assistant' })).toBeTruthy()
  expect(screen.getByRole('button', { name: 'Close chat' })).toBe(launcher)
})
