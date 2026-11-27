import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const initMock = vi.fn()
const captureMock = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('posthog-js', () => ({
  default: {
    init: initMock,
    capture: captureMock,
  },
}))

vi.mock('posthog-js/react', () => ({
  PostHogProvider: ({ children }: { children: React.ReactNode }) => children,
  usePostHog: () => ({ capture: captureMock }),
}))

describe('PostHogProvider', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    initMock.mockClear()
    captureMock.mockClear()
  })

  it('initializes PostHog with privacy-masked session replay covering inputs and CodeMirror text', async () => {
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'phc_test_key')
    vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://us.i.posthog.com')

    const { PostHogProvider } = await import('@/app/providers')
    render(
      <PostHogProvider>
        <div>content</div>
      </PostHogProvider>,
    )

    expect(initMock).toHaveBeenCalledWith(
      'phc_test_key',
      expect.objectContaining({
        api_host: 'https://us.i.posthog.com',
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '.cm-content',
        },
      }),
    )
  })
})
