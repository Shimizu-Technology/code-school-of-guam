import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { ChatWindow } from '../components/chat-window'

const originalScroll = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollIntoView')
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  if (originalScroll) Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', originalScroll)
  else Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView')
  sessionStorage.clear()
})

test('chatbot failure retains conversation, restores input, and allows a successful retry without real providers', async () => {
  sessionStorage.clear()
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  const failureLog = vi.spyOn(console, 'error').mockImplementation(() => {})
  const request = vi.fn()
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'Unavailable' }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ response: 'Public enrollment is not open. Please join the updates list.' }) })
  vi.stubGlobal('fetch', request)
  const close = vi.fn()
  render(<ChatWindow onClose={close} />)
  const input = screen.getByRole('textbox', { name: 'Message the Code School assistant' }) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'Can I enroll now?' } })
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }))
  expect(input.disabled).toBe(true)
  await waitFor(() => expect(screen.getByRole('log').textContent).toContain('The assistant could not answer right now'))
  expect(screen.getByRole('log').textContent).toContain('Can I enroll now?')
  expect(screen.getByRole('log').textContent).toContain('codeschoolofguam@gmail.com')
  expect(input.disabled).toBe(false)
  fireEvent.change(input, { target: { value: 'Where can I get updates?' } })
  fireEvent.keyDown(input, { key: 'Enter' })
  await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Public enrollment is not open'))
  expect(request).toHaveBeenCalledTimes(2)
  for (const [url, options] of request.mock.calls) {
    expect(url).toBe('/api/chat')
    expect(options.method).toBe('POST')
  }
  const retryBody = JSON.parse(request.mock.calls[1][1].body)
  expect(retryBody.message).toBe('Where can I get updates?')
  expect(retryBody.history.some((message: { content: string }) => message.content === 'Can I enroll now?')).toBe(true)
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(close).toHaveBeenCalledTimes(1)
  expect(failureLog).toHaveBeenCalledOnce()
})

test('assistant answers wrap long words, scroll wide code and GFM tables, and keep links readable', () => {
  sessionStorage.setItem('csg-chat-messages', JSON.stringify([
    { role: 'user', content: 'Compare the offers.' },
    { role: 'assistant', content: [
      '```python',
      'expenses = {"food": 61, "transport": 48, "supplies": 9}  # a deliberately long line wider than the bubble',
      '```',
      '',
      '| Offer | Status |',
      '| --- | --- |',
      '| Python Fundamentals pilot | Invited |',
      '| March 2026 bootcamp | Closed |',
      '',
      'See [the course](https://codeschoolofguam.com/courses/python-fundamentals) or https://codeschoolofguam.com/faq.',
    ].join('\n') },
  ]))
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  render(<ChatWindow onClose={vi.fn()} />)
  const log = screen.getByRole('log')

  const table = within(log).getByRole('table')
  expect(within(table).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual(['Offer', 'Status'])
  expect(table.querySelectorAll('tbody tr')).toHaveLength(2)
  expect(table.parentElement!.className).toContain('overflow-x-auto')
  expect(log.textContent).not.toContain('| --- |')

  const pre = log.querySelector('pre')!
  expect(pre.className).toContain('overflow-x-auto')
  expect(pre.textContent).toContain('expenses = {')

  const bubble = pre.closest('.chat-markdown')!.parentElement!
  expect(bubble.className).not.toMatch(/\boverflow-hidden\b/)
  expect(bubble.className).toContain('min-w-0')
  expect(bubble.className).toContain('[overflow-wrap:anywhere]')

  const links = Array.from(log.querySelectorAll('a'))
  expect(links.map((link) => link.getAttribute('href'))).toEqual(['https://codeschoolofguam.com/courses/python-fundamentals', 'https://codeschoolofguam.com/faq'])
  for (const link of links) {
    expect(link.className).toContain('break-words')
    expect(link.className).not.toContain('break-all')
  }
})

test('chat controls are touch sized and the message field does not trigger iOS focus zoom', () => {
  sessionStorage.clear()
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() })
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })))
  render(<ChatWindow onClose={vi.fn()} />)
  const input = screen.getByRole('textbox', { name: 'Message the Code School assistant' })
  expect(input.className).toContain('text-base')
  expect(input.className).not.toMatch(/\btext-sm\b/)
  for (const name of ['Close chat', 'Expand chat', 'Send message']) {
    const control = screen.getByRole('button', { name })
    expect(control.className).toContain('h-11')
    expect(control.className).toContain('w-11')
  }
  const dialog = screen.getByRole('dialog')
  expect(dialog.className).toContain('csg-chat-window')
  expect(dialog.className).not.toContain('transition-all')
})
