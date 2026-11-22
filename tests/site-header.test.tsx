import { afterEach, expect, test, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SiteHeader } from '../components/site-header'

vi.mock('next/navigation', () => ({ usePathname: () => '/courses/python-fundamentals' }))
vi.mock('next/image', () => ({ default: (props: Record<string, unknown>) => <img alt="" {...props} /> }))

afterEach(async () => { cleanup(); await new Promise((resolve) => setTimeout(resolve, 0)); vi.unstubAllGlobals() })

test('navigation identifies the current learning path and closes an open menu at the desktop breakpoint', () => {
  let listener: (() => void) | undefined
  const media = { matches: false, addEventListener: vi.fn((_event, callback) => { listener = callback }), removeEventListener: vi.fn() }
  vi.stubGlobal('matchMedia', vi.fn(() => media))
  render(<SiteHeader />)
  expect(screen.getByRole('link', { name: 'Courses' }).getAttribute('aria-current')).toBe('page')
  expect(screen.getByRole('link', { name: 'Partners' }).getAttribute('href')).toBe('/partners')
  expect(screen.getByRole('link', { name: 'Student work' }).getAttribute('aria-current')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
  expect(screen.getByRole('dialog')).toBeTruthy()
  expect(screen.getByRole('link', { name: 'Bootcamp curriculum' })).toBeTruthy()
  media.matches = true
  act(() => listener!())
  expect(screen.queryByRole('dialog')).toBeNull()
  expect(document.body.style.overflow).not.toBe('hidden')
})

test('menu controls meet the 44px touch target, internal CTAs use a forward arrow, and CSG Learn links externally', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
  render(<SiteHeader />)
  const brand = screen.getByRole('link', { name: /Code School of Guam/ })
  expect(brand.className).toContain('min-h-11')
  const open = screen.getByRole('button', { name: 'Open menu' })
  expect(open.className).toContain('h-11')
  expect(open.className).toContain('w-11')

  const desktopCsgLearn = screen.getByRole('link', { name: /CSG Learn/ })
  expect(desktopCsgLearn.getAttribute('href')).toBe('https://learn.codeschoolofguam.com/')
  expect(desktopCsgLearn.querySelector('.lucide-arrow-up-right')).toBeTruthy()

  const desktopCta = screen.getByRole('link', { name: /Course updates/ })
  expect(desktopCta.querySelector('.lucide-arrow-up-right')).toBeNull()
  expect(desktopCta.querySelector('.lucide-arrow-right')).toBeTruthy()

  fireEvent.click(open)
  const close = screen.getByRole('button', { name: 'Close' })
  expect(close.className).toContain('h-11')
  expect(close.className).toContain('w-11')
  const dialog = screen.getByRole('dialog')
  expect(dialog.className).toContain('csg-sheet')
  expect(dialog.className).not.toMatch(/duration-500|ease-in-out/)

  const mobileCta = Array.from(dialog.querySelectorAll('a')).find((a) => a.getAttribute('href') === '/courses#course-interest')!
  expect(mobileCta.querySelector('.lucide-arrow-up-right')).toBeNull()
  expect(mobileCta.querySelector('.lucide-arrow-right')).toBeTruthy()

  const mobileCsgLearn = Array.from(dialog.querySelectorAll('a')).find((a) => a.getAttribute('href') === 'https://learn.codeschoolofguam.com/')!
  expect(mobileCsgLearn.querySelector('.lucide-arrow-up-right')).toBeTruthy()
})
