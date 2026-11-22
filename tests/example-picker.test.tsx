import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ExamplePicker } from '../components/home/example-picker'

afterEach(cleanup)

test('picker exposes its modified state in its name, and Escape is consumed only while open', () => {
  const change = vi.fn()
  render(<ExamplePicker value="expense_summary.py" modified onChange={change} />)
  const picker = screen.getByRole('combobox', { name: 'Python example (modified)' })
  expect(picker.querySelector('.home-editor-dirty')!.getAttribute('aria-hidden')).toBe('true')
  const escape = () => new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
  const closed = escape()
  fireEvent(picker, closed)
  expect(closed.defaultPrevented).toBe(false)
  fireEvent.click(picker)
  expect(screen.getByRole('listbox').parentElement).toBe(document.body)
  const open = escape()
  fireEvent(picker, open)
  expect(open.defaultPrevented).toBe(true)
  expect(screen.queryByRole('listbox')).toBeNull()
  fireEvent.click(picker)
  fireEvent.click(screen.getByRole('option', { name: 'bubble_sort.py' }))
  expect(change).toHaveBeenCalledWith('bubble_sort.py')
  expect(document.activeElement).toBe(picker)
})
