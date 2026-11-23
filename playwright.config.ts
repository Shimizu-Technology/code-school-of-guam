import { defineConfig, devices } from '@playwright/test'

// Browser checks for the homepage hero editor (not part of `npm run check`; run after `npm run build`).
//   npx playwright test --project=desktop-chrome --project=mobile-chrome
//   iPhone WebKit: run on a machine where WebKit starts (on the Mac mini, use asus-test).
const port = Number(process.env.E2E_PORT ?? 3210)
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: 'tests/e2e',
  outputDir: 'test-results/e2e',
  workers: 1,
  retries: 0,
  timeout: 90_000,
  reporter: [['list']],
  use: { baseURL, trace: 'retain-on-failure' },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: 'npm start', env: { PORT: String(port) }, url: baseURL, reuseExistingServer: false, timeout: 60_000 },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    // Touch emulation at 390×844. No Android user agent: CodeMirror's Android input path expects a real IME,
    // which synthetic key events cannot reproduce (verify Android on a real phone).
    { name: 'mobile-chrome', use: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } },
    { name: 'iphone-webkit', use: { ...devices['iPhone 15'] } },
  ],
})
