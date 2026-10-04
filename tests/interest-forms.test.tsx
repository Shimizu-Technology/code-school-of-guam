import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { CohortInterestForm } from '../components/cohort-interest-form'
import { PythonInterestForm } from '../components/python-interest-form'
import { CourseInterestForm } from '../components/course-interest-form'
import { readFileSync } from 'node:fs'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

const forms = [
  ['next-cohort-interest', CohortInterestForm],
  ['python-fundamentals-interest', PythonInterestForm],
  ['focused-courses-interest', CourseInterestForm],
] as const

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

for (const [name, Form] of forms) {
  test(`${name} has the same named fields as Netlify discovery and requires consent`, () => {
    const { container } = render(<Form />)
    const form = container.querySelector('form')!
    const discovery = new DOMParser().parseFromString(readFileSync('public/__forms.html', 'utf8'), 'text/html').querySelector(`form[name="${name}"]`)!
    const names = (el: Element) => Array.from(el.querySelectorAll('[name]')).map((input) => input.getAttribute('name')).sort()
    expect(form.getAttribute('name')).toBe(name)
    expect(names(form)).toEqual(names(discovery))
    expect(form.querySelector<HTMLInputElement>('[name="update_consent"]')!.required).toBe(true)
    expect(form.querySelector<HTMLInputElement>('[name="email"]')!.type).toBe('email')
  })

  test(`${name} posts encoded form data and announces success only after the response`, async () => {
    let finish!: (response: { ok: boolean }) => void
    const request = vi.fn(() => new Promise((resolve) => { finish = resolve }))
    vi.stubGlobal('fetch', request)
    const { container } = render(<Form />)
    const form = container.querySelector('form')!
    fillRequiredFields(form)
    fireEvent.submit(form)
    expect(request).toHaveBeenCalledTimes(1)
    const [url, options] = request.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('/__forms.html')
    expect(options.method).toBe('POST')
    const body = new URLSearchParams(String(options.body))
    expect(body.get('form-name')).toBe(name)
    expect(body.get('name')).toBe('Test Learner')
    expect(body.get('email')).toBe('learner@example.invalid')
    expect(body.get('update_consent')).toBe('yes')
    if (name === 'next-cohort-interest') expect(body.get('preferred_timing')).toBe('Weekday daytime')
    expect(screen.queryByRole('status')).toBeNull()
    expect(form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(true)
    finish({ ok: true })
    await waitFor(() => expect(screen.getByRole('status')).toBeTruthy())
    expect(container.querySelector('form')).toBeNull()
  })

  test(`${name} retains a learner's response and offers contact when submission fails`, async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const { container } = render(<Form />)
    const form = container.querySelector('form')!
    fillRequiredFields(form)
    fireEvent.submit(form)
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
    expect(form.querySelector<HTMLInputElement>('[name="name"]')!.value).toBe('Test Learner')
    expect(screen.getByRole('link', { name: 'codeschoolofguam@gmail.com' }).getAttribute('href')).toBe('mailto:codeschoolofguam@gmail.com')
    expect(form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled).toBe(false)
  })
}

test('bootcamp interest collects availability without suggesting a start date', () => {
  const { container } = render(<CohortInterestForm />)
  expect(container.textContent).toContain('dates, schedule, and tuition have not been announced')
  expect(container.textContent).not.toMatch(/January|February|2027/)
  expect(Array.from(container.querySelectorAll('select[name="preferred_timing"] option')).map((option) => option.textContent)).toEqual(['Select a preference', 'Weekday daytime', 'Weekday evenings', 'Weekends', "I'm flexible"])
})
