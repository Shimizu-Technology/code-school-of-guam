import { afterEach, expect, test, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
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
