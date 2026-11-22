import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PythonInterestForm } from '../components/python-interest-form'
import { UnifiedInquiryForm, type InquiryMode } from '../components/unified-inquiry-form'
import { readFileSync } from 'node:fs'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function fillRequiredFields(form: HTMLFormElement) {
  fireEvent.change(form.querySelector('[name="name"]')!, { target: { value: 'Test Learner' } })
  fireEvent.change(form.querySelector('[name="email"]')!, { target: { value: 'learner@example.invalid' } })
  const discovery = new DOMParser().parseFromString(readFileSync('public/__forms.html', 'utf8'), 'text/html').querySelector(`form[name="${form.name}"]`)!
  for (const select of form.querySelectorAll<HTMLSelectElement>('select[required]')) {
    const value = Array.from(select.options).find((option) => option.value && !option.disabled)!.value
    const discovered = discovery.querySelector<HTMLSelectElement>(`select[name="${select.name}"]`)!
    expect(Array.from(discovered.options).map((option) => option.value)).toContain(value)
    fireEvent.change(select, { target: { value } })
  }
  for (const textarea of form.querySelectorAll<HTMLTextAreaElement>('textarea[required]')) {
    fireEvent.change(textarea, { target: { value: 'Learn to build a useful project.' } })
  }
  fireEvent.click(form.querySelector('[name="update_consent"]')!)
  expect(form.checkValidity()).toBe(true)
}

test('python-fundamentals-interest has the same named fields as Netlify discovery and requires consent', () => {
  const { container } = render(<PythonInterestForm />)
  const form = container.querySelector('form')!
  const discovery = new DOMParser().parseFromString(readFileSync('public/__forms.html', 'utf8'), 'text/html').querySelector('form[name="python-fundamentals-interest"]')!
  const names = (el: Element) => Array.from(el.querySelectorAll('[name]')).map((input) => input.getAttribute('name')).sort()
  expect(form.getAttribute('name')).toBe('python-fundamentals-interest')
  expect(names(form)).toEqual(names(discovery))
  expect(form.querySelector<HTMLInputElement>('[name="update_consent"]')!.required).toBe(true)
  expect(form.querySelector<HTMLInputElement>('[name="email"]')!.type).toBe('email')
})

test('python-fundamentals-interest posts encoded form data, announces success, and retains input on failure', async () => {
  let finish!: (response: { ok: boolean }) => void
  const request = vi.fn(() => new Promise((resolve) => { finish = resolve }))
  vi.stubGlobal('fetch', request)
  const { container, unmount } = render(<PythonInterestForm />)
  const form = container.querySelector('form')!
  fillRequiredFields(form)
  fireEvent.submit(form)
  expect(request).toHaveBeenCalledTimes(1)
  const [url, options] = request.mock.calls[0] as unknown as [string, RequestInit]
  expect(url).toBe('/__forms.html')
  expect(options.method).toBe('POST')
  const body = new URLSearchParams(String(options.body))
  expect(body.get('form-name')).toBe('python-fundamentals-interest')
  expect(body.get('name')).toBe('Test Learner')
  expect(body.get('email')).toBe('learner@example.invalid')
  expect(body.get('update_consent')).toBe('yes')
  expect(screen.queryByRole('status')).toBeNull()
  expect(form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true)
  finish({ ok: true })
  await waitFor(() => expect(screen.getByRole('status')).toBeTruthy())
  expect(container.querySelector('form')).toBeNull()
  unmount()

  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
  const errView = render(<PythonInterestForm />)
  const errForm = errView.container.querySelector('form')!
  fillRequiredFields(errForm)
  fireEvent.submit(errForm)
  await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
  expect(errForm.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe('Test Learner')
  expect(screen.getByRole('link', { name: 'codeschoolofguam@gmail.com' }).getAttribute('href')).toBe('mailto:codeschoolofguam@gmail.com')
})

const unifiedModes: readonly [InquiryMode, string, string][] = [
  ['course', 'focused-courses-interest', 'Focused-course updates list'],
  ['bootcamp', 'next-cohort-interest', 'Full bootcamp updates list'],
  ['partner', 'partner-inquiry', 'Partner inquiry form'],
]

for (const [mode, formName, ariaLabel] of unifiedModes) {
  test(`UnifiedInquiryForm (${mode}) matches Netlify __forms.html, requires only 3 fields, and uses 16px + h-12 selects`, async () => {
    const request = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', request)
    const { container } = render(<UnifiedInquiryForm defaultMode={mode} />)
    const form = screen.getByRole('form', { name: ariaLabel }) as HTMLFormElement
    expect(form.getAttribute('name')).toBe(formName)

    const discovery = new DOMParser().parseFromString(readFileSync('public/__forms.html', 'utf8'), 'text/html').querySelector(`form[name="${formName}"]`)!
    const names = (el: Element) => Array.from(el.querySelectorAll('[name]')).map((input) => input.getAttribute('name')).sort()
    expect(names(form)).toEqual(names(discovery))

    // Only Name, Email, and Consent are required (low friction).
    const requiredNames = Array.from(form.querySelectorAll('[required]')).map((el) => el.getAttribute('name')).sort()
    expect(requiredNames).toEqual(['email', 'name', 'update_consent'])

    const fields = form.querySelectorAll<HTMLElement>('input:not([type="hidden"]):not([type="checkbox"]):not([name="bot-field"]), select, textarea')
    for (const field of fields) {
      expect(field.className, field.getAttribute('name')!).toContain('text-base')
      expect(field.className).not.toMatch(/\btext-sm\b/)
    }
    for (const select of form.querySelectorAll<HTMLSelectElement>('select')) {
      expect(select.className).toContain('h-12')
      expect(select.className).toContain('text-base')
    }
    const consent = form.querySelector<HTMLInputElement>('[name="update_consent"]')!
    expect(consent.className).toContain('shrink-0')
    expect(consent.className).toContain('h-5')
    expect(consent.className).toContain('w-5')

    fireEvent.change(form.querySelector('[name="name"]')!, { target: { value: 'Guam Learner' } })
    fireEvent.change(form.querySelector('[name="email"]')!, { target: { value: 'learner@example.invalid' } })
    fireEvent.click(form.querySelector('[name="update_consent"]')!)
    expect(form.checkValidity()).toBe(true)
    fireEvent.submit(form)
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy())
    const [, options] = request.mock.calls[0] as [string, RequestInit]
    expect(new URLSearchParams(String(options.body)).get('form-name')).toBe(formName)
    expect(container.querySelector('form')).toBeNull()
  })
}

test('UnifiedInquiryForm preserves typed Name and Email when switching chips', () => {
  const { container } = render(<UnifiedInquiryForm defaultMode="course" />)
  const nameInput = () => container.querySelector<HTMLInputElement>('input[name="name"]')!
  const emailInput = () => container.querySelector<HTMLInputElement>('input[name="email"]')!

  fireEvent.change(nameInput(), { target: { value: 'Maria Santos' } })
  fireEvent.change(emailInput(), { target: { value: 'maria@example.invalid' } })

  fireEvent.click(screen.getByRole('button', { name: 'School / employer partner' }))
  expect(screen.getByRole('form', { name: 'Partner inquiry form' }).getAttribute('name')).toBe('partner-inquiry')
  expect(nameInput().value).toBe('Maria Santos')
  expect(emailInput().value).toBe('maria@example.invalid')

  fireEvent.click(screen.getByRole('button', { name: 'Full bootcamp' }))
  expect(screen.getByRole('form', { name: 'Full bootcamp updates list' }).getAttribute('name')).toBe('next-cohort-interest')
  expect(nameInput().value).toBe('Maria Santos')
  expect(emailInput().value).toBe('maria@example.invalid')
})

test('UnifiedInquiryForm bootcamp mode collects availability without suggesting a start date', () => {
  const { container } = render(<UnifiedInquiryForm defaultMode="bootcamp" />)
  expect(container.textContent).toContain('dates, schedule, and tuition have not been announced')
  expect(container.textContent).not.toMatch(/January|February|2027/)
  expect(Array.from(container.querySelectorAll('select[name="preferred_timing"] option')).map((option) => option.textContent)).toEqual(['Select a preference', 'Weekday daytime', 'Weekday evenings', 'Weekends', "I'm flexible"])
})
