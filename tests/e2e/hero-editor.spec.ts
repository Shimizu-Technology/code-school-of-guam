import { expect, test as base, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import expectedOutput from '../fixtures/python-example-output.json'
import { PYTHON_EXAMPLES, CLEAR_PYTHON_CODE } from '../../lib/python-sample'

const test = base.extend<{ saveData: boolean }>({ saveData: [true, { option: true }] })

const SHOTS = process.env.E2E_SHOTS_DIR ?? path.join('test-results', 'hero-editor')
fs.mkdirSync(SHOTS, { recursive: true })

const isTouch = (projectName: string) => projectName !== 'desktop-chrome'
/** CodeMirror treats iOS like macOS (Cmd shortcuts); elsewhere Ctrl/Cmd follows the host. */
const mod = () => (test.info().project.name.includes('iphone') ? 'Meta' : 'ControlOrMeta')

async function shot(page: Page, name: string, projectName: string, target: 'editor' | 'viewport' = 'editor') {
  const file = path.join(SHOTS, `${projectName}-${name}.png`)
  if (target === 'editor') await page.locator('figure.home-editor').screenshot({ path: file })
  else await page.screenshot({ path: file, scale: 'css' })
}

async function editorAction(page: Page, name: 'Clear Python editor' | 'Reset to original Python example') {
  const desktop = page.getByRole('button', { name, exact: true })
  if (await desktop.isVisible()) await desktop.click()
  else {
    await page.getByRole('button', { name: 'More editor actions' }).click()
    await page.getByRole('menuitem', { name, exact: true }).click()
  }
}

/** The live document, read from CodeMirror's rendered lines. */
async function editorText(page: Page) {
  return page.locator('.cm-content').evaluate((el) =>
    Array.from(el.querySelectorAll('.cm-line')).map((line) => line.textContent ?? '').join('\n'),
  )
}

async function focusedInEditor(page: Page) {
  return page.evaluate(() => !!document.activeElement?.closest('.cm-content'))
}

/** Replace the whole program without auto-indent or auto-close interfering. */
async function replaceProgram(page: Page, program: string) {
  // Select everything through the DOM (no key chords: iOS has no Cmd+A on the soft keyboard).
  await page.locator('.cm-content').evaluate((el) => {
    const range = document.createRange()
    range.selectNodeContents(el)
    const sel = document.getSelection()!
    sel.removeAllRanges()
    sel.addRange(range)
  })
  await page.waitForTimeout(50)
  await page.keyboard.press('Backspace')
  if (program) await page.keyboard.insertText(program)
  await expect.poll(() => editorText(page)).toBe(program)
}

async function openEditor(page: Page, projectName: string) {
  const button = page.getByRole('button', { name: 'Edit Python code' })
  if (isTouch(projectName)) await button.tap()
  else await button.click()
  await expect(page.locator('.cm-content')).toBeVisible()
  await expect.poll(() => focusedInEditor(page)).toBe(true)
  await expect(page.locator('.cm-content')).toHaveCSS('font-size', isTouch(projectName) || (page.viewportSize()?.width ?? 1440) <= 640 ? '16px' : '14px')
}

test.beforeEach(async ({ page, saveData }) => {
  // Legacy interaction scenarios explicitly exercise the data-saving click-to-run path.
  await page.addInitScript(saveData => {
    Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData, effectiveType: '4g' } })
    ;(window as unknown as { __shifts: number }).__shifts = 0
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & { value: number; hadRecentInput: boolean }
          if (!shift.hadRecentInput) (window as unknown as { __shifts: number }).__shifts += shift.value
        }
      }).observe({ type: 'layout-shift', buffered: true })
    }
  }, saveData)
  // A controllable visualViewport so we can simulate the on-screen keyboard (it cannot be opened in automation).
  if (process.env.E2E_BASE_URL?.includes('deploy-preview-')) {
    // Netlify injects its Collaborate drawer only on hosted previews.
    await page.addStyleTag({ content: 'iframe[data-netlify-deploy-preview], iframe#netlify-collaboration, iframe[src*="netlify"][src*="drawer"] { display: none !important; pointer-events: none !important; }' }).catch(() => {})
    await page.addInitScript(() => {
      const hideDrawer = () => document.querySelectorAll<HTMLIFrameElement>('iframe').forEach(frame => {
        if (/netlify/i.test(frame.src + frame.id) && /drawer|collaborat|deploy-preview/i.test(frame.src + frame.id)) frame.style.setProperty('display', 'none', 'important')
      })
      new MutationObserver(hideDrawer).observe(document, { childList: true, subtree: true })
      document.addEventListener('DOMContentLoaded', hideDrawer)
    })
  }
  await page.addInitScript(() => {
    const real = window.visualViewport
    if (!real) return
    let keyboard = 0
    const fake = new EventTarget() as EventTarget & Record<string, number>
    for (const key of ['width', 'offsetLeft', 'offsetTop', 'pageLeft', 'pageTop', 'scale'] as const) {
      Object.defineProperty(fake, key, { get: () => (real as unknown as Record<string, number>)[key] })
    }
    Object.defineProperty(fake, 'height', { get: () => real.height - keyboard })
    real.addEventListener('resize', () => fake.dispatchEvent(new Event('resize')))
    real.addEventListener('scroll', () => fake.dispatchEvent(new Event('scroll')))
    Object.defineProperty(window, 'visualViewport', { configurable: true, get: () => fake })
    ;(window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard = (height: number) => {
      keyboard = height
      fake.dispatchEvent(new Event('resize'))
    }
  })
})

test('first load: highlighted code with no editor JavaScript and no sideways overflow', async ({ page }, testInfo) => {
  const scripts: string[] = []
  page.on('response', async (response) => {
    if (response.request().resourceType() === 'script') scripts.push(await response.text().catch(() => ''))
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  const code = page.getByRole('region', { name: 'Sample Python code: guam_weather.py' })
  await expect(code.locator('.home-tok-k').first()).toHaveText('for')
  await expect(code.locator('.home-tok-s').first()).toHaveCSS('color', 'rgb(165, 227, 185)')
  expect(scripts.some((src) => src.includes('cm-gutterElement'))).toBe(false)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
  const fontSize = await code.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  expect(fontSize).toBeGreaterThanOrEqual(isTouch(testInfo.project.name) ? 16 : 14)
  await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
  await shot(page, '01-read-only', testInfo.project.name)
})

test('tapping the code swaps in CodeMirror with no layout shift and the cursor where you tapped', async ({ page }, testInfo) => {
  const editorChunks: number[] = []
  page.on('response', async (response) => {
    if (response.request().resourceType() !== 'script') return
    const body = await response.body().catch(() => null)
    if (body && /cm-gutterElement|highlightTree|FormatReplacement|placeCursorAtEnd/.test(body.toString())) editorChunks.push(body.length)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  const region = page.getByRole('region', { name: 'Sample Python code: guam_weather.py' })
  await region.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => ({
    lines: Array.from(document.querySelectorAll('.home-code-line')).map((el) => {
      const r = el.getBoundingClientRect()
      return [Math.round((r.top + window.scrollY) * 10) / 10, Math.round(r.height * 10) / 10]
    }),
    area: Math.round(document.querySelector('.home-code-area')!.getBoundingClientRect().height),
    color: getComputedStyle(document.querySelector('.home-code-static .home-tok-f')!).color,
  }))
  // Tap inside line 11; source and live lines must stay aligned.
  const target = region.locator('.home-code-row').nth(10)
  const box = (await target.boundingBox())!
  const point = { x: box.x + 80, y: box.y + box.height / 2 }
  if (isTouch(testInfo.project.name)) await page.touchscreen.tap(point.x, point.y)
  else await page.mouse.click(point.x, point.y)
  await expect(page.locator('.cm-content')).toBeVisible()
  await expect.poll(() => focusedInEditor(page)).toBe(true)
  const after = await page.evaluate(() => {
    const sel = document.getSelection()!
    const line = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? (sel.anchorNode as Element) : sel.anchorNode.parentElement)!.closest('.cm-line')
    return {
      lines: Array.from(document.querySelectorAll('.cm-line')).map((el) => {
        const r = el.getBoundingClientRect()
        return [Math.round((r.top + window.scrollY) * 10) / 10, Math.round(r.height * 10) / 10]
      }),
      area: Math.round(document.querySelector('.home-code-area')!.getBoundingClientRect().height),
      color: getComputedStyle(document.querySelector('.cm-content .home-tok-f')!).color,
      cursorLine: line ? Array.from(document.querySelectorAll('.cm-line')).indexOf(line) + 1 : -1,
    }
  })
  expect(after.area).toBe(before.area)
  expect(after.lines.length).toBe(before.lines.length)
  after.lines.forEach(([top, height], i) => {
    expect(Math.abs(top - before.lines[i][0])).toBeLessThanOrEqual(0.6)
    expect(Math.abs(height - before.lines[i][1])).toBeLessThanOrEqual(0.6)
  })
  expect(after.color).toBe(before.color)
  expect(after.cursorLine).toBe(11)
  const gz = editorChunks.reduce((a, b) => a + b, 0)
  testInfo.annotations.push({ type: 'editor-chunk-decoded-bytes', description: String(gz) })
  console.log(`[${testInfo.project.name}] editor chunks loaded on tap: ${editorChunks.length} files, ${(gz / 1024).toFixed(1)} KB decoded body sizes`)
  await shot(page, '02-editing-focused', testInfo.project.name)
})

test('a real editor: indent after colon, auto-closing brackets and quotes, smart backspace, undo, Escape-Tab exit', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await replaceProgram(page, '')
  await page.keyboard.type('def greet(name):')
  await page.keyboard.press('Enter')
  expect(await editorText(page)).toBe('def greet(name):\n    ')
  // Typing ( and " auto-closes; typing the closer steps over it.
  await page.keyboard.type('print("Hi, " + name)')
  expect(await editorText(page)).toBe('def greet(name):\n    print("Hi, " + name)')
  await page.keyboard.press('Enter')
  expect(await editorText(page)).toBe('def greet(name):\n    print("Hi, " + name)\n    ')
  // Backspace in the indentation removes a whole level.
  await page.keyboard.press('Backspace')
  expect(await editorText(page)).toBe('def greet(name):\n    print("Hi, " + name)\n')
  await page.keyboard.type('greet("Guam")')
  if (!testInfo.project.name.includes('iphone')) {
    await page.keyboard.press(`${mod()}+z`)
    expect(await editorText(page)).not.toContain('greet("Guam")')
    await page.keyboard.press(`${mod()}+Shift+z`)
    expect(await editorText(page)).toContain('greet("Guam")')
  }
  // Tab indents; Shift-Tab outdents.
  await page.keyboard.press('Home')
  await page.keyboard.press('Tab')
  expect(await editorText(page)).toContain('\n    greet("Guam")')
  await page.keyboard.press('Shift+Tab')
  expect(await editorText(page)).toContain('\ngreet("Guam")')
  // Active line is highlighted while focused.
  await expect(page.locator('.cm-activeLine')).toHaveCount(1)
  await shot(page, '03-typed-program', testInfo.project.name)
  // Keyboard users can leave: Escape, then Tab, moves focus out instead of indenting.
  if (!isTouch(testInfo.project.name)) {
    await page.keyboard.press('Escape')
    await page.keyboard.press('Tab')
    expect(await focusedInEditor(page)).toBe(false)
    expect(await editorText(page)).toContain('\ngreet("Guam")')
  }
})

test('Run executes the edited program and brings the output into view; Reset restores the sample', async ({ page }, testInfo) => {
  test.setTimeout(150_000)
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await replaceProgram(page, 'for i in range(3):\n    print("Hafa adai", i)')
  if (isTouch(testInfo.project.name)) {
    await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Run your Python code' }).tap()
  } else {
    await page.keyboard.press(`${mod()}+Enter`)
  }
  const term = page.getByRole('region', { name: 'Python program output' })
  await expect(term).toContainText('Hafa adai 2', { timeout: 120_000 })
  await expect(page.getByRole('status').filter({ hasText: 'Program finished' })).toHaveCount(1)
  const inView = await term.evaluate((el) => {
    const r = el.getBoundingClientRect()
    return r.top >= 0 && r.top < window.innerHeight
  })
  expect(inView).toBe(true)
  await shot(page, '04-ran', testInfo.project.name)
  await editorAction(page, 'Reset to original Python example')
  await expect.poll(() => editorText(page)).toContain('for month in rain:')
  await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
  // Reset is undoable.
  if (isTouch(testInfo.project.name)) {
    await page.locator('.cm-content').focus()
    await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Undo' }).tap()
  } else {
    await page.keyboard.press(`${mod()}+z`)
  }
  await expect.poll(() => editorText(page)).toContain('Hafa adai')
})

test('long lines scroll sideways with a fixed gutter and a 60-line program stays bounded', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  const longLine = 'message = "' + 'Learning Python on Guam is fun, '.repeat(5) + '"'
  const url = 'docs = "https://code.shimizu-technology.com/' + 'a'.repeat(90) + '"'
  const body = Array.from({ length: 56 }, (_, i) => (i % 7 === 3 ? `    total += ${i}  # running total for step ${i}` : `total = ${i} * 2`))
  await replaceProgram(page, ['def run():', '    total = 0', longLine, url, ...body].join('\n'))
  await page.locator('.cm-scroller').evaluate((el) => { el.scrollTop = 0 })
  await page.waitForTimeout(150)
  const m = await page.evaluate(() => {
    const scroller = document.querySelector('.cm-scroller') as HTMLElement
    const gutters = Array.from(document.querySelectorAll<HTMLElement>('.cm-lineNumbers .cm-gutterElement')).filter((el) => el.offsetHeight > 0)
    const lines = Array.from(document.querySelectorAll('.cm-line'))
    const misaligned = lines.slice(0, 8).filter((line, i) => {
      const g = gutters[i]
      return !g || Math.abs(g.getBoundingClientRect().top - line.getBoundingClientRect().top) > 1
    }).length
    return {
      pageOverflow: document.documentElement.scrollWidth - window.innerWidth,
      scrollerOverflowX: scroller.scrollWidth - scroller.clientWidth,
      height: scroller.getBoundingClientRect().height,
      scrolls: scroller.scrollHeight > scroller.clientHeight + 10,
      innerHeight: window.innerHeight,
      misaligned,
      wrappedLongLine: lines[2].getBoundingClientRect().height > parseFloat(getComputedStyle(lines[2]).lineHeight) * 1.5,
      hang: getComputedStyle(lines[2]).textIndent,
    }
  })
  expect(m.pageOverflow).toBeLessThanOrEqual(0)
  expect(m.scrollerOverflowX).toBeGreaterThan(100)
  expect(m.scrolls).toBe(true)
  expect(m.height).toBeLessThanOrEqual(Math.min(34 * 16, m.innerHeight * 0.75) + 1)
  expect(m.misaligned).toBe(0)
  expect(m.wrappedLongLine).toBe(false)
  expect(m.hang).toBe('0px')
  const gutterLeft = await page.locator('.cm-gutters').evaluate(el => el.getBoundingClientRect().left)
  await expect(page.locator('.home-code-area')).toHaveAttribute('data-more-code', '')
  await page.locator('.cm-scroller').evaluate(el => { el.scrollLeft = el.scrollWidth; el.scrollTop = 0 })
  await expect(page.locator('.home-code-area')).not.toHaveAttribute('data-more-code')
  expect(await page.locator('.cm-gutters').evaluate(el => el.getBoundingClientRect().left)).toBeCloseTo(gutterLeft, 0)
  await shot(page, '05-long-program', testInfo.project.name)
})

test('touch: coding keys sit above the keyboard, keep focus, and insert code', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'coding keys are for touch screens')
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await replaceProgram(page, '')
  const keys = page.getByRole('toolbar', { name: 'Coding keys' })
  await expect(keys).toBeVisible()
  for (const name of ['Run your Python code', 'Indent (Tab)', 'Insert colon', 'Insert parentheses', 'Insert square brackets', 'Insert curly braces', 'Insert quotes', 'Insert equals sign', 'Insert hash (comment)', 'Move cursor left', 'Move cursor right', 'Undo']) {
    await expect(keys.getByRole('button', { name })).toHaveCount(1)
  }
  const tapKey = async (name: string) => {
    const key = keys.getByRole('button', { name })
    await key.scrollIntoViewIfNeeded()
    await key.tap()
  }
  await page.keyboard.type('print')
  await tapKey('Insert parentheses')
  await tapKey('Insert quotes')
  await page.keyboard.type('Hi')
  expect(await editorText(page)).toBe('print("Hi")')
  await page.keyboard.type('")')
  expect(await editorText(page)).toBe('print("Hi")')
  expect(await focusedInEditor(page)).toBe(true)
  await tapKey('Move cursor left')
  await tapKey('Move cursor left')
  await tapKey('Move cursor right')
  await tapKey('Move cursor right')
  await page.keyboard.press('Enter')
  await page.keyboard.type('if True')
  await tapKey('Insert colon')
  await page.keyboard.press('Enter')
  expect(await editorText(page)).toBe('print("Hi")\nif True:\n    ')
  await tapKey('Insert hash (comment)')
  expect(await editorText(page)).toBe('print("Hi")\nif True:\n    #')
  await tapKey('Undo')
  expect(await editorText(page)).not.toContain('#')
  await replaceProgram(page, 'if True:\n')
  await tapKey('Indent (Tab)')
  expect(await editorText(page)).toBe('if True:\n    ')
  expect(await focusedInEditor(page)).toBe(true)

  await replaceProgram(page, 'expenses = {"Food": 61, "Transport": 48}\nfor item, cost in expenses.items():\n    if cost > 50:\n        print(f"{item} is over budget: ${cost}")\n    else:\n        print(item, "is fine")\n')

  // Keyboard closed: the bar sits on the bottom edge (above the home indicator).
  const closed = await keys.boundingBox()
  const vh = await page.evaluate(() => window.visualViewport!.height)
  expect(Math.abs(closed!.y + closed!.height - vh)).toBeLessThanOrEqual(1)

  // Simulate a 336px keyboard: the bar rides on top of it and the editor shrinks to fit above.
  await page.evaluate(() => (window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard(336))
  await expect(page.locator('figure.home-editor[data-keyboard="open"]')).toHaveCount(1)
  await expect.poll(async () => {
    const b = await keys.boundingBox()
    return Math.round(b!.y + b!.height)
  }).toBe(Math.round(vh - 336))
  // The page lines the code up under the header, and the whole editor fits above the coding keys.
  await page.waitForTimeout(150)
  const layout = await page.evaluate(() => {
    const r = document.querySelector('.cm-scroller')!.getBoundingClientRect()
    const k = document.querySelector('.home-keys')!.getBoundingClientRect()
    return { scrollerTop: Math.round(r.top), scrollerBottom: Math.round(r.bottom), keysTop: Math.round(k.top), vv: window.visualViewport!.height, scrollY: Math.round(window.scrollY) }
  })
  console.log(`[${testInfo.project.name}] keyboard-open layout ${JSON.stringify(layout)}`)
  await expect.poll(async () => {
    const keysTop = (await keys.boundingBox())!.y
    return page.locator('.cm-scroller').evaluate((el, top) => {
      const r = el.getBoundingClientRect()
      return r.top >= 0 && r.bottom <= top + 1
    }, keysTop)
  }).toBe(true)
  // Draw a stand-in keyboard for the screenshot.
  await page.evaluate(() => {
    const kb = document.createElement('div')
    kb.id = 'fake-keyboard'
    kb.textContent = 'on-screen keyboard (simulated)'
    Object.assign(kb.style, { position: 'fixed', left: '0', right: '0', bottom: '0', height: '336px', background: '#d1d4da', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '600 15px system-ui', zIndex: '80' })
    document.body.appendChild(kb)
  })
  await shot(page, '06-keyboard-open-mock', testInfo.project.name, 'viewport')
  await page.evaluate(() => {
    document.getElementById('fake-keyboard')?.remove()
    ;(window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard(0)
  })
  await expect(page.locator('figure.home-editor[data-keyboard="open"]')).toHaveCount(0)
})

test('reduced motion: no press animation and instant scrolling', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/', { waitUntil: 'networkidle' })
  const run = page.getByRole('button', { name: 'Run the Python example in your browser' })
  // The site-wide reduced-motion rule leaves at most 0.01ms; the editor's own rules remove transitions.
  const durations = await run.evaluate((el) => getComputedStyle(el).transitionDuration.split(',').map((d) => parseFloat(d)))
  for (const d of durations) expect(d).toBeLessThanOrEqual(0.0001)
  test.info().annotations.push({ type: 'project', description: testInfo.project.name })
})


test('delayed editor import transfers focus directly from the proxy and inserts pending input once', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'iOS-style focus handoff')
  await page.goto('/', { waitUntil: 'networkidle' })
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/_next/static/chunks/*.js', async route => { await gate; await route.continue() })
  await page.getByRole('button', { name: 'Edit Python code' }).tap()
  await expect(page.locator('.home-focus-proxy')).toBeFocused()
  await page.keyboard.insertText('\nprint("buffered")')
  await page.evaluate(() => {
    const proxy = document.querySelector('.home-focus-proxy')!
    proxy.addEventListener('focusout', event => {
      document.body.dataset.handoffTarget = (event as FocusEvent).relatedTarget instanceof HTMLElement && (event as FocusEvent).relatedTarget !== document.body ? 'editor' : 'body'
    })
    const remove = proxy.remove.bind(proxy)
    proxy.remove = () => {
      document.body.dataset.focusAtRemoval = document.activeElement?.closest('.cm-content') ? 'editor' : 'body'
      remove()
    }
  })
  release()
  await expect(page.locator('.cm-content')).toBeFocused()
  await expect(page.locator('body')).toHaveAttribute('data-handoff-target', 'editor')
  await expect(page.locator('body')).toHaveAttribute('data-focus-at-removal', 'editor')
  expect((await editorText(page)).split('buffered')).toHaveLength(2)
  await expect(page.locator('.home-focus-proxy')).toHaveCount(0)
})

test('rejected editor import retains pending input on retry, and Reset clears pending input', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'touch proxy buffering')
  for (const reset of [false, true]) {
    await page.goto('/', { waitUntil: 'networkidle' })
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    const fail = async (route: import('@playwright/test').Route) => { await gate; await route.abort() }
    await page.route('**/_next/static/chunks/*.js', fail)
    await page.getByRole('button', { name: 'Edit Python code' }).tap()
    await page.keyboard.insertText('\nprint("pending")')
    if (reset) await editorAction(page, 'Reset to original Python example')
    release()
    await expect(page.locator('.home-code-note-error')).toContainText('The editor didn’t load.')
    await page.unroute('**/_next/static/chunks/*.js', fail)
    await page.getByRole('button', { name: 'Try again' }).tap()
    await expect(page.locator('.cm-content')).toBeFocused()
    expect((await editorText(page)).split('pending')).toHaveLength(reset ? 1 : 2)
    await expect(page.locator('.home-focus-proxy')).toHaveCount(0)
  }
})

test('Escape then Tab or Shift-Tab exits even with a selection; desktop hint is below the code', async ({ page }, testInfo) => {
  test.skip(isTouch(testInfo.project.name), 'desktop keyboard navigation')
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  const code = await page.locator('.home-code-area').boundingBox()
  const hint = await page.locator('.home-code-hint').boundingBox()
  expect(hint!.y).toBeGreaterThanOrEqual(code!.y + code!.height)
  for (const tab of ['Tab', 'Shift+Tab']) {
    await page.locator('.cm-content').focus()
    await page.keyboard.press(`${mod()}+a`)
    await page.keyboard.press('Escape')
    await page.keyboard.press(tab)
    expect(await focusedInEditor(page)).toBe(false)
  }
})

test('touch landscape: code clears the coding keys and the chat launcher stays hidden', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'touch landscape')
  await page.setViewportSize({ width: 844, height: 390 })
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await expect(page.locator('body')).toHaveAttribute('data-coding-keys', 'open')
  await expect(page.locator('.chat-launcher')).toBeHidden()
  expect(await page.locator('.chat-launcher').evaluate(el => getComputedStyle(el).pointerEvents)).toBe('none')
  await page.evaluate(() => (window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard(180))
  await expect.poll(async () => {
    const code = (await page.locator('.cm-scroller').boundingBox())!
    const keys = (await page.locator('.home-keys').boundingBox())!
    return code.y >= 0 && code.y + code.height <= keys.y
  }).toBe(true)
  await page.locator('.cm-content').blur()
  await expect(page.locator('body')).not.toHaveAttribute('data-coding-keys', 'open')
  await expect(page.locator('figure.home-editor')).not.toHaveAttribute('style', /code-kb-max-h/)
})


test('Clear from the static view is undoable; editing, reset and the example picker work with keyboard and touch', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
  await editorAction(page, 'Clear Python editor')
  await expect(page.locator('.cm-content')).toBeFocused()
  await expect.poll(() => editorText(page)).toBe(CLEAR_PYTHON_CODE)
  await expect(page.locator('.cm-content')).toHaveCSS('font-size', isTouch(testInfo.project.name) ? '16px' : '14px')
  await shot(page, '07-cleared', testInfo.project.name)
  if (isTouch(testInfo.project.name)) {
    await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Undo' }).tap()
  } else await page.keyboard.press(`${mod()}+z`)
  await expect.poll(() => editorText(page)).toBe(PYTHON_EXAMPLES[1].code)
  const picker = page.getByRole('combobox', { name: /^Python example(?: \(modified\))?$/ })
  if (isTouch(testInfo.project.name)) await picker.tap()
  else await picker.click()
  await expect(page.getByRole('listbox', { name: 'Python examples' })).toBeVisible()
  await expect(picker).toBeFocused()
  await shot(page, '08-picker-open', testInfo.project.name)
  await page.keyboard.press('End')
  await page.keyboard.press('Enter')
  await expect.poll(() => editorText(page)).toBe(PYTHON_EXAMPLES.at(-1)!.code)
  await editorAction(page, 'Clear Python editor')
  await editorAction(page, 'Reset to original Python example')
  await expect.poll(() => editorText(page)).toBe(PYTHON_EXAMPLES.at(-1)!.code)
})

test('all seven examples execute cleanly in real Pyodide and carry their code into Hafa Code', async ({ page }, testInfo) => {
  test.setTimeout(240_000)
  await page.goto('/', { waitUntil: 'networkidle' })
  for (const example of PYTHON_EXAMPLES) {
    await page.getByRole('combobox', { name: /^Python example(?: \(modified\))?$/ }).click()
    await page.getByRole('option', { name: example.filename, exact: true }).click()
    await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
    await expect(page.locator('.home-term')).not.toHaveAttribute('data-stale')
    await expect(page.locator('.home-example-caption')).toHaveText(example.caption)
    const url = await page.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')
    const params = new URLSearchParams(url!.split('#')[1])
    const project = JSON.parse(Buffer.from(params.get('project')!, 'base64url').toString())
    expect(params.get('starter')).toBe(example.starterKey)
    expect(project).toMatchObject({ entryPath: example.filename, files: [{ path: example.filename, content: example.code }] })
    await page.locator('.home-editor-actions').getByRole('button', { name: /Run (your Python code|the Python example in your browser)/ }).click()
    await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser', { timeout: 120_000 })
    await expect(page.locator('.home-term')).toContainText(example.lastOutput)
    await expect(page.locator('.home-term > .home-term-line')).toHaveText(expectedOutput[example.filename as keyof typeof expectedOutput])
    await expect(page.locator('.home-term-err')).toHaveCount(0)
    if (example.filename === 'guam_weather.py') await shot(page, '09-weather-ran', testInfo.project.name)
  }
})

test('Edit keeps the editor top, header height and code position stable across toolbar breakpoints', async ({ page }, testInfo) => {
  test.skip(isTouch(testInfo.project.name), 'desktop breakpoint coverage')
  for (const width of [600, 640, 1200, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
    const geometry = () => page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect()
      return { top: rect('figure.home-editor').top + scrollY, codeTop: rect('.home-code-area').top + scrollY, headerHeight: rect('.home-editor-top').height }
    })
    const before = await geometry()
    await page.getByRole('button', { name: 'Edit Python code' }).click()
    await expect(page.locator('.cm-content')).toBeFocused()
    const after = await geometry()
    for (const metric of ['top', 'codeTop', 'headerHeight'] as const) {
      expect(Math.abs(after[metric] - before[metric]), `${width}px ${metric}`).toBeLessThanOrEqual(0.6)
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0)
  }
})

test('touch picker clears the keyboard viewport, scrolls to its last options and keeps focus after selecting', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'touch keyboard viewport')
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await page.evaluate(() => (window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard(440))
  const picker = page.getByRole('combobox', { name: /^Python example/ })
  for (const filename of ['bubble_sort.py', 'password_check.py', 'chamorro_hello.py']) {
    await picker.tap()
    const list = page.getByRole('listbox', { name: 'Python examples' })
    await expect(list).toBeVisible()
    expect(await list.evaluate(el => el.parentElement === document.body)).toBe(true)
    await expect.poll(() => list.evaluate(el => {
      const r = el.getBoundingClientRect(), vv = window.visualViewport!
      return r.top >= vv.offsetTop && r.bottom <= vv.offsetTop + vv.height && el.scrollHeight > el.clientHeight
    })).toBe(true)
    // Options must not cancel pointerdown: native touch swipes should scroll the list.
    expect(await list.getByRole('option').first().evaluate(el => {
      const event = new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerType: 'touch' })
      el.dispatchEvent(event)
      return event.defaultPrevented
    })).toBe(false)
    const option = list.getByRole('option', { name: filename, exact: true })
    await option.scrollIntoViewIfNeeded()
    await option.tap()
    await expect(picker).toBeFocused()
    await expect.poll(() => editorText(page)).toBe(PYTHON_EXAMPLES.find(example => example.filename === filename)!.code)
    await expect(page.locator('.home-focus-proxy')).toHaveCount(0)
    await expect(page.getByRole('toolbar', { name: 'Coding keys' })).toHaveCount(0)
  }
})

test('background example load failure shows the selected source without opening the keyboard', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.route('**/_next/static/chunks/*.js', route => route.abort())
  const picker = page.getByRole('combobox', { name: /^Python example/ })
  await picker.click()
  await page.getByRole('option', { name: 'expense_summary.py', exact: true }).click()
  await expect(page.locator('.home-code-note-error')).toBeVisible()
  await expect(picker).toBeFocused()
  await expect(page.locator('.home-focus-proxy')).toHaveCount(0)
  const fallback = page.getByRole('region', { name: 'Sample Python code: expense_summary.py' })
  await expect(fallback.locator('pre')).toHaveText(PYTHON_EXAMPLES[0].code)
  await page.unroute('**/_next/static/chunks/*.js')
  await page.getByRole('button', { name: 'Edit Python code' }).click()
  await expect(page.locator('.cm-content')).toBeFocused()
  expect(await editorText(page)).toBe(PYTHON_EXAMPLES[0].code)
})

test('Clear then Run during a delayed editor load executes the cleared program', async ({ page }) => {
  test.setTimeout(150_000)
  await page.goto('/', { waitUntil: 'networkidle' })
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/_next/static/chunks/*.js', async route => { await gate; await route.continue() })
  await editorAction(page, 'Clear Python editor')
  await page.locator('.home-editor-actions').getByRole('button', { name: 'Run your Python code' }).click()
  await expect(page.locator('.home-term-note')).toHaveText('(Program finished with no output)', { timeout: 120_000 })
  await expect(page.locator('.home-term-err')).toHaveCount(0)
  release()
  await expect.poll(() => editorText(page)).toBe(CLEAR_PYTHON_CODE)
  await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser')
  await expect(page.locator('.home-term')).not.toHaveAttribute('data-stale')
})

test('clean multi-line output starts at line one and output typography follows viewport breakpoints', async ({ page }, testInfo) => {
  test.setTimeout(150_000)
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await replaceProgram(page, 'for n in range(40):\n    print("Line", n)')
  await page.locator('.home-editor-actions').getByRole('button', { name: 'Run your Python code' }).click()
  await expect(page.locator('.home-term-status-ok')).toBeVisible({ timeout: 120_000 })
  const term = page.locator('.home-term')
  await expect(term).toContainText('Line 39')
  expect(await term.evaluate(el => el.scrollTop)).toBe(0)
  expect(await page.locator('.home-term-bar').evaluate(el => {
    const r = el.getBoundingClientRect(), parent = el.parentElement!.getBoundingClientRect()
    return r.top >= parent.top && r.bottom <= parent.bottom
  })).toBe(true)
  for (const [width, font] of [[350, '11px'], [390, '12px'], [1440, '13px']] as const) {
    await page.setViewportSize({ width, height: 844 })
    await expect(term).toHaveCSS('font-size', font)
  }
})

test('slow Clear immediately updates the document/link and Run includes buffered typing, which later transfers once', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'touch proxy input')
  test.setTimeout(150_000)
  await page.goto('/', { waitUntil: 'networkidle' })
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/_next/static/chunks/*.js', async route => { await gate; await route.continue() })
  await editorAction(page, 'Clear Python editor')
  await expect(page.getByRole('combobox', { name: 'Python example (modified)' })).toBeVisible()
  const href = await page.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')
  const payload = new URLSearchParams(href!.split('#')[1]).get('project')!
  expect(JSON.parse(Buffer.from(payload, 'base64url').toString()).files[0].content).toBe(CLEAR_PYTHON_CODE)
  await expect(page.locator('.home-code-fallback')).toHaveText(CLEAR_PYTHON_CODE)
  await page.keyboard.insertText('print("hello")')
  await page.locator('.home-editor-actions').getByRole('button', { name: 'Run your Python code' }).tap()
  await expect(page.locator('.home-term-status-ok')).toHaveCount(0)
  expect(await page.locator('.home-focus-proxy').inputValue()).toBe('print("hello")')
  release()
  await expect(page.locator('.home-term-status-ok')).toBeVisible({ timeout: 120_000 })
  await expect(page.locator('.home-term')).toContainText('hello')
  await expect(page.locator('.home-term')).not.toHaveAttribute('data-stale')
  await expect.poll(() => editorText(page)).toBe(CLEAR_PYTHON_CODE + 'print("hello")')
  await page.locator('.cm-content').focus()
  await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Undo' }).tap()
  await expect.poll(() => editorText(page)).toBe(CLEAR_PYTHON_CODE)
  await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Undo' }).tap()
  await expect.poll(() => editorText(page)).toBe(PYTHON_EXAMPLES[1].code)
})

test('Clear remains current through an import rejection and retry seeds the original document for Undo', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.route('**/_next/static/chunks/*.js', route => route.abort())
  await editorAction(page, 'Clear Python editor')
  await expect(page.locator('.home-code-note-error')).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Python example (modified)' })).toBeVisible()
  await expect(page.locator('.home-code-fallback')).toHaveText(CLEAR_PYTHON_CODE)
  const href = await page.getByRole('link', { name: /Open in Hafa Code/ }).getAttribute('href')
  expect(JSON.parse(Buffer.from(new URLSearchParams(href!.split('#')[1]).get('project')!, 'base64url').toString()).files[0].content).toBe(CLEAR_PYTHON_CODE)
  await page.unroute('**/_next/static/chunks/*.js')
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.locator('.cm-content')).toBeFocused()
  expect(await editorText(page)).toBe(CLEAR_PYTHON_CODE)
  if (isTouch(testInfo.project.name)) await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Undo' }).tap()
  else await page.keyboard.press(`${mod()}+z`)
  await expect.poll(() => editorText(page)).toBe(PYTHON_EXAMPLES[1].code)
})

test('a delayed import does not reclaim focus after the visitor leaves the editor workflow', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'networkidle' })
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/_next/static/chunks/*.js', async route => { await gate; await route.continue() })
  await page.getByRole('button', { name: 'Edit Python code' }).click()
  // iPhone emulation has no hardware Tab navigation; keep an explicit outside
  // focus target for touch, and reach the same target with Tab on desktop.
  await page.evaluate(() => {
    const next = document.createElement('button')
    next.textContent = 'Outside editor test target'
    document.querySelector('figure.home-editor')!.after(next)
  })
  const elsewhere = page.getByRole('link', { name: /Open in Hafa Code/ })
  await elsewhere.focus()
  const next = page.getByRole('button', { name: 'Outside editor test target' })
  if (isTouch(testInfo.project.name)) await next.focus()
  else await page.keyboard.press('Tab')
  await expect(next).toBeFocused()
  await expect.poll(() => page.evaluate(() => !!document.activeElement && !document.activeElement.closest('figure.home-editor'))).toBe(true)
  const focused = await page.evaluate(() => { document.activeElement!.setAttribute('data-focus-before-ready', 'true'); return document.activeElement!.tagName })
  release()
  await expect(page.locator('.cm-content')).toBeVisible()
  await expect(page.locator('[data-focus-before-ready="true"]')).toBeFocused()
  expect(await page.evaluate(() => document.activeElement!.tagName)).toBe(focused)
  await expect(page.locator('.home-focus-proxy')).toHaveCount(0)
})

test('first toolbar Run waits for keyboard close before revealing output; header Run reveals after render', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'touch keyboard close')
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await page.evaluate(() => {
    ;(window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard(336)
    const term = document.querySelector<HTMLElement>('.home-term')!
    term.dataset.reveals = '0'
    term.scrollIntoView = () => { term.dataset.reveals = String(Number(term.dataset.reveals) + 1) }
    // Hold only the close-keyboard fallback so assertions don't depend on machine speed.
    const timeout = window.setTimeout.bind(window)
    window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => timeout(handler, delay === 700 ? 10_000 : delay, ...args)) as typeof window.setTimeout
  })
  await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Run your Python code' }).tap()
  await expect(page.locator('.home-term')).toBeVisible()
  await expect(page.locator('.home-term')).toHaveAttribute('data-reveals', '0')
  await page.evaluate(() => (window as unknown as { __setKeyboard: (h: number) => void }).__setKeyboard(0))
  await expect(page.locator('.home-term')).toHaveAttribute('data-reveals', '1')
  await editorAction(page, 'Reset to original Python example')
  await page.locator('.home-editor-actions').getByRole('button', { name: 'Run your Python code' }).tap()
  await expect(page.locator('.home-term')).toHaveAttribute('data-reveals', '2')
})

async function enableAutomaticRun(page: Page, visible = true) {
  await page.addInitScript(({ visible }) => {
    // Hold the idle gate so screenshots and interaction races are deterministic.
    window.requestIdleCallback = callback => {
      ;(window as unknown as { __releaseIdle: () => void }).__releaseIdle = () => callback({ didTimeout: false, timeRemaining: () => 50 })
      return 1
    }
    window.cancelIdleCallback = () => {}
    if (!visible) {
      const OriginalObserver = window.IntersectionObserver
      window.IntersectionObserver = class extends OriginalObserver {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          super(entries => callback(entries.filter(entry => !entry.target.matches('figure.home-editor')), this), options)
          this.heroCallback = callback
        }
        heroCallback: IntersectionObserverCallback
        observe(target: Element) {
          if (target.matches('figure.home-editor')) {
            let connected = true
            ;(window as unknown as { __showEditor: () => void }).__showEditor = () => {
              if (connected) this.heroCallback([{ target, isIntersecting: true } as IntersectionObserverEntry], this)
            }
            this.disconnectHero = () => { connected = false }
          } else super.observe(target)
        }
        disconnectHero?: () => void
        disconnect() { this.disconnectHero?.(); super.disconnect() }
      }
    }
  }, { visible })
}

async function releaseIdle(page: Page) {
  await expect.poll(() => page.evaluate(() => typeof (window as unknown as { __releaseIdle?: () => void }).__releaseIdle)).toBe('function')
  await page.evaluate(() => (window as unknown as { __releaseIdle: () => void }).__releaseIdle())
}

test('one-row toolbar fits at 320, 375, 390 and 430px with touch targets', async ({ page }) => {
  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 812 })
    await page.goto('/', { waitUntil: 'networkidle' })
    const boxes = await page.locator('.home-editor-top button').evaluateAll(elements => elements.filter(el => el.getClientRects().length).map(el => {
      const r = el.getBoundingClientRect()
      return { x: r.x, y: r.y, width: r.width, height: r.height }
    }))
    expect(Math.max(...boxes.map(r => r.y)) - Math.min(...boxes.map(r => r.y))).toBeLessThanOrEqual(2)
    for (const box of boxes) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(width)
      expect(box.height).toBeGreaterThanOrEqual(44)
    }
    expect(boxes.at(-1)!.height).toBeGreaterThanOrEqual(44)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test.describe('automatic execution', () => {
  test.use({ saveData: false })

  test('automatic first visit runs real weather without scrolling, focus movement or layout shift', async ({ page }, testInfo) => {
    test.setTimeout(150_000)
    await page.setViewportSize({ width: isTouch(testInfo.project.name) ? 375 : 1440, height: isTouch(testInfo.project.name) ? 812 : 900 })
    await enableAutomaticRun(page)
    const transfers: { url: string; decodedBytes: number; transferBytes: number }[] = []
    page.on('response', async response => {
      if (response.url().includes('cdn.jsdelivr.net/pyodide/')) {
        const body = await response.body().catch(() => null)
        if (body) {
          const sizes = await response.request().sizes()
          transfers.push({ url: response.url(), decodedBytes: body.length, transferBytes: sizes.responseBodySize })
        }
      }
    })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
    await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
    await shot(page, 'r7-loading', testInfo.project.name, 'viewport')
    const before = await page.evaluate(() => {
      document.body.setAttribute('data-focus-baseline', '')
      return { scroll: scrollY, focused: document.activeElement?.tagName }
    })
    const started = Date.now()
    await releaseIdle(page)
    await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser', { timeout: 120_000 })
    await expect(page.locator('.home-term')).toContainText('Sep ███████ 350')
    const bars = await page.locator('.home-term-block').evaluateAll(elements => elements.map(el => ({ characters: el.textContent!.length, width: el.getBoundingClientRect().width })))
    for (const bar of bars) expect(Math.abs(bar.width / bar.characters - bars[0].width)).toBeLessThan(0.1)
    expect(await page.locator('.home-term').evaluate(el => el.scrollHeight <= el.clientHeight)).toBe(true)
    expect(await page.evaluate(() => scrollY)).toBe(before.scroll)
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe(before.focused)
    const cls = await page.evaluate(() => (window as unknown as { __shifts: number }).__shifts)
    const clsSupported = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('layout-shift'))
    if (clsSupported) expect(cls).toBeLessThan(0.01)
    else testInfo.annotations.push({ type: 'CLS', description: 'Layout Instability API unavailable in this browser; Chromium measures navigation-start CLS.' })
    console.log(JSON.stringify({ project: testInfo.project.name, timeToOutputMs: Date.now() - started, cls: clsSupported ? cls : null, pyodideResponseBytes: transfers.reduce((sum, item) => sum + item.transferBytes, 0), transfers }))
    await expect(page.locator('.home-editor [aria-live=polite]')).toHaveText('')
    await shot(page, 'r7-first-visit', testInfo.project.name, 'viewport')
    await openEditor(page, testInfo.project.name)
    await replaceProgram(page, 'print("changed")')
    await expect(page.locator('.home-term')).toHaveAttribute('data-stale', '')
    await expect(page.locator('.home-term')).toContainText('Press Run to update')
    await expect(page.locator('.home-term-status-ok')).toHaveCount(0)
    await page.getByRole('combobox', { name: /^Python example/ }).click()
    await page.getByRole('option', { name: 'tip_split.py', exact: true }).click()
    await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
  })

})

test('save-data reserves its footprint without loading Python or shifting after hydration', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: isTouch(testInfo.project.name) ? 375 : 1440, height: isTouch(testInfo.project.name) ? 812 : 900 })
  const workers: string[] = []
  page.on('worker', worker => workers.push(worker.url()))
  await page.goto('/', { waitUntil: 'networkidle' })
  await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
  await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
  expect(workers).toEqual([])
  expect(await page.locator('.home-term').evaluate(el => el.getBoundingClientRect().height)).toBe(224)
  const cls = await page.evaluate(() => PerformanceObserver.supportedEntryTypes.includes('layout-shift') ? (window as unknown as { __shifts: number }).__shifts : null)
  if (cls !== null) expect(cls).toBeLessThan(0.01)
  else testInfo.annotations.push({ type: 'CLS', description: 'Layout Instability API unavailable in this browser; Chromium measures navigation-start CLS.' })
  console.log(JSON.stringify({ project: testInfo.project.name, saveData: true, navigationCLS: cls }))
  await shot(page, 'r7-save-data', testInfo.project.name, 'viewport')
})

test.describe('automatic execution races', () => {
  test.use({ saveData: false })

  test('interaction before visibility cancels automatic run; unseen editor loads no worker', async ({ page }) => {
    await enableAutomaticRun(page, false)
    const workers: string[] = []
    page.on('worker', worker => workers.push(worker.url()))
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByRole('combobox', { name: /^Python example/ }).focus()
    await releaseIdle(page)
    await page.evaluate(() => (window as unknown as { __showEditor: () => void }).__showEditor())
    await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
    expect(workers).toEqual([])
  })

  test('Run during automatic runtime loading shares the in-flight execution', async ({ page }, testInfo) => {
    await page.setViewportSize({ width: isTouch(testInfo.project.name) ? 375 : 1440, height: isTouch(testInfo.project.name) ? 812 : 900 })
    test.setTimeout(150_000)
    await enableAutomaticRun(page)
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    // Delay the actual worker script, leaving the real Pyodide execution intact.
    let runs = 0
    await page.route('**/workers/python-runner.js', async route => {
      const response = await route.fetch()
      await gate
      await route.fulfill({ response, body: (await response.text()).replace('if (type !== "run") return;', 'if (type !== "run") return; self.postMessage({ type: "count-run" });') })
    })
    await page.addInitScript(() => {
      const OriginalWorker = window.Worker
      window.Worker = class extends OriginalWorker {
        constructor(url: string | URL, options?: WorkerOptions) {
          super(url, options)
          this.addEventListener('message', event => {
            if (event.data.type === 'count-run') document.body.dataset.pythonRuns = String(Number(document.body.dataset.pythonRuns ?? 0) + 1)
          })
        }
      }
    })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
    await releaseIdle(page)
    await expect(page.locator('.home-term-status')).toHaveText('Loading Python…')
    await shot(page, 'r7-loading', testInfo.project.name, 'viewport')
    await page.locator('.home-editor-actions .home-run').click()
    await expect(page.locator('.home-editor-actions .home-run')).toHaveAccessibleName('Stop running Python')
    await expect(page.locator('.home-editor [aria-live=polite]')).toContainText('Loading Python runtime')
    release()
    await expect(page.locator('.home-term-status-ok')).toBeVisible({ timeout: 120_000 })
    runs = Number(await page.locator('body').getAttribute('data-python-runs'))
    expect(runs).toBe(1)
    await expect(page.locator('.home-editor [aria-live=polite]')).toContainText('Program finished')
  })

})

test('phone menu and every filename remain usable including the modified dot', async ({ page }, testInfo) => {
  test.setTimeout(180_000)
  for (const width of [375, 390, 430]) {
    await page.setViewportSize({ width, height: 812 })
    await page.goto('/', { waitUntil: 'networkidle' })
    const more = page.getByRole('button', { name: 'More editor actions' })
    await more.click()
    await expect(more).toHaveAttribute('aria-expanded', 'true')
    const items = page.getByRole('menuitem')
    await expect(items.first()).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(items.last()).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(items.first()).toBeFocused()
    await page.keyboard.press('End')
    await expect(items.last()).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(more).toBeFocused()
    await expect(page.getByRole('menu')).toHaveCount(0)
    await more.click()
    if (width === 375) await shot(page, 'r7-menu-open', testInfo.project.name, 'viewport')
    await page.locator('.home-example-caption').click({ position: { x: 2, y: 2 } })
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(more).toBeFocused()
    for (const example of PYTHON_EXAMPLES) {
      const picker = page.getByRole('combobox', { name: /^Python example/ })
      await picker.click()
      await page.getByRole('option', { name: example.filename, exact: true }).click()
      await expect(page.locator('.cm-content')).toBeVisible()
      if (width === 375 && example.filename === 'expense_summary.py') await shot(page, 'r7-expense-selected', testInfo.project.name, 'viewport')
      await page.locator('.cm-content').focus()
      await page.keyboard.insertText('#')
      await expect(picker).toHaveAccessibleName('Python example (modified)')
      await expect(page.getByRole('button', { name: 'Edit Python code' })).toBeVisible()
      const filename = picker.locator('span').first()
      await expect(filename).toHaveText(example.filename)
      expect(await filename.evaluate(el => el.scrollWidth <= el.clientWidth), `${width}px ${example.filename}`).toBe(true)
      expect(await picker.locator('.home-editor-dirty').isVisible()).toBe(true)
      await editorAction(page, 'Reset to original Python example')
      await expect(page.locator('.home-term')).not.toHaveAttribute('data-stale')
      await editorAction(page, 'Clear Python editor')
      await expect(page.locator('.home-term')).not.toHaveAttribute('data-stale')
    }
  }
})

test('static code enters edit mode with Enter and Space', async ({ page }) => {
  for (const key of ['Enter', 'Space']) {
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.getByRole('region', { name: 'Sample Python code: guam_weather.py' }).focus()
    await page.keyboard.press(key)
    await expect(page.locator('.cm-content')).toBeFocused()
  }
})

test('a delayed import runs the buffered text at its tap position, not appended', async ({ page }, testInfo) => {
  test.skip(!isTouch(testInfo.project.name), 'touch input buffered in the focus proxy')
  test.setTimeout(150_000)
  await page.addInitScript(() => {
    const Original = window.Worker
    window.Worker = class extends Original {
      postMessage(message: { type?: string; code?: string }) {
        if (message.type === 'run') document.body.dataset.executedSource = message.code
        super.postMessage(message)
      }
    }
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  let release!: () => void
  const gate = new Promise<void>(resolve => { release = resolve })
  await page.route('**/_next/static/chunks/*.js', async route => { await gate; await route.continue() })
  const literal = page.locator('.home-code-static .home-tok-s').first()
  await literal.scrollIntoViewIfNeeded()
  const rect = (await literal.boundingBox())!
  await page.touchscreen.tap(rect.x + rect.width * 0.4, rect.y + rect.height / 2)
  await expect(page.locator('.home-focus-proxy')).toBeFocused()
  await page.keyboard.insertText('R5')
  await page.locator('.home-editor-actions .home-run').tap()
  expect(await page.locator('body').getAttribute('data-executed-source')).toBeNull()
  release()
  await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser', { timeout: 120_000 })
  const sourceDocument = await editorText(page)
  expect(sourceDocument).toContain('R5')
  expect(sourceDocument.endsWith('R5')).toBe(false)
  await expect(page.locator('body')).toHaveAttribute('data-executed-source', sourceDocument)
  await expect(page.locator('.home-term')).toContainText('R5')
  await expect(page.locator('.home-term')).not.toHaveAttribute('data-stale')
})

test('edited tracebacks are visibly stale and manual re-runs keep the output height', async ({ page }, testInfo) => {
  test.setTimeout(150_000)
  await page.goto('/', { waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await replaceProgram(page, '1 / 0')
  await page.locator('.home-editor-actions .home-run').click()
  await expect(page.locator('.home-term-err')).toContainText('ZeroDivisionError', { timeout: 120_000 })
  await replaceProgram(page, 'print("fixed")')
  await expect(page.locator('.home-term')).toHaveAttribute('data-stale', '')
  await expect(page.locator('.home-term-err')).toHaveCSS('opacity', '0.55')
  await page.locator('.home-editor-actions .home-run').click()
  await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser')
  expect(await page.locator('.home-term').evaluate(el => el.getBoundingClientRect().height)).toBe(224)
})

test.describe('automatic run regressions', () => {
  test.use({ saveData: false })

  test('unseen plus idle creates no worker; showing the hero starts it', async ({ page }) => {
    await enableAutomaticRun(page, false)
    const workers: string[] = []
    page.on('worker', worker => workers.push(worker.url()))
    await page.goto('/', { waitUntil: 'networkidle' })
    await releaseIdle(page)
    expect(workers).toEqual([])
    await page.evaluate(() => (window as unknown as { __showEditor: () => void }).__showEditor())
    await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser', { timeout: 120_000 })
    expect(workers).toHaveLength(1)
    await expect(page.locator('.home-editor [aria-live=polite]')).toHaveText('')
  })

  test('pending cancellation preserves pointer and keyboard geometry; footer links still navigate', async ({ page, context }) => {
    await enableAutomaticRun(page)
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/', { waitUntil: 'networkidle' })
      const edit = page.getByRole('button', { name: 'Edit Python code' })
      await edit.scrollIntoViewIfNeeded()
      const before = (await edit.boundingBox())!
      await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2)
      await page.mouse.down()
      const after = (await edit.boundingBox())!
      expect(Math.abs(after.y - before.y)).toBeLessThan(0.5)
      expect(await page.locator('.home-term').evaluate(el => el.getBoundingClientRect().height)).toBe(224)
      await page.mouse.up()
      await expect(page.locator('.cm-content')).toBeFocused()
      await page.goto('/', { waitUntil: 'networkidle' })
      const code = page.getByRole('region', { name: 'Sample Python code: guam_weather.py' })
      const top = await page.locator('figure.home-editor').evaluate(el => el.getBoundingClientRect().top + scrollY)
      await code.focus()
      expect(await page.locator('figure.home-editor').evaluate(el => el.getBoundingClientRect().top + scrollY)).toBe(top)
      await page.locator('.home-editor').getByRole('link', { name: 'Python Fundamentals', exact: true }).click()
      await expect(page).toHaveURL(/\/courses\/python-fundamentals$/)
      await page.goto('/', { waitUntil: 'networkidle' })
      await context.route('https://code.shimizu-technology.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Hafa link test</title>' }))
      const popupReady = page.waitForEvent('popup')
      await page.getByRole('link', { name: /Open in Hafa Code/ }).click()
      const popup = await popupReady
      await expect(popup).toHaveURL(/code\.shimizu-technology\.com/)
      await popup.close()
    }
  })

  for (const failure of ['message', 'worker-error', 'timeout'] as const) {
    test(`automatic ${failure} fails quietly; explicit Run preserves manual error feedback`, async ({ page }) => {
      await enableAutomaticRun(page)
      await page.addInitScript(failure => {
        const timeout = window.setTimeout.bind(window)
        window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => timeout(handler, delay === 90000 ? 100 : delay, ...args)) as typeof window.setTimeout
        let requests = 0
        window.Worker = class {
          onmessage: ((event: { data: unknown }) => void) | null = null
          onerror: (() => void) | null = null
          postMessage(data: { type: string; id: string }) {
            if (data.type !== 'run') return
            requests++
            if (requests === 1 && failure === 'timeout') return
            timeout(() => {
              if (requests === 1 && failure === 'worker-error') this.onerror?.()
              else this.onmessage?.({ data: { id: data.id, type: 'error', message: 'Raw importScripts WorkerGlobalScope failure' } })
            }, 0)
          }
          terminate() {}
        } as unknown as typeof Worker
      }, failure)
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
      await releaseIdle(page)
      await expect(page.locator('.home-term-note')).toContainText("Couldn't load Python here")
      await expect(page.locator('.home-term-err')).toHaveCount(0)
      await expect(page.locator('.home-editor [aria-live=polite]')).toHaveText('')
      expect(await page.locator('.home-term').evaluate(el => el.getBoundingClientRect().height)).toBe(224)
      await page.locator('.home-editor-actions .home-run').click()
      await expect(page.locator('.home-term-err')).toContainText('Raw importScripts')
      await expect(page.locator('.home-editor [aria-live=polite]')).toContainText('Could not run Python')
    })
  }

  test('typing invalidates automatic output while keeping its worker download warm', async ({ page }, testInfo) => {
    test.setTimeout(150_000)
    await enableAutomaticRun(page)
    await page.addInitScript(() => {
      const Original = window.Worker
      window.Worker = class extends Original {
        constructor(url: string | URL, options?: WorkerOptions) {
          super(url, options)
          document.body.dataset.workers = String(Number(document.body.dataset.workers ?? 0) + 1)
          this.addEventListener('message', event => {
            if (event.data.type === 'result') document.body.dataset.results = String(Number(document.body.dataset.results ?? 0) + 1)
          })
        }
        terminate() { document.body.dataset.terminated = 'true'; super.terminate() }
      }
    })
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    await page.route('**/workers/python-runner.js', async route => { await gate; await route.continue() })
    await page.goto('/', { waitUntil: 'networkidle' })
    await page.locator('figure.home-editor').scrollIntoViewIfNeeded()
    await releaseIdle(page)
    await expect(page.locator('.home-term-status')).toHaveText('Loading Python…')
    await openEditor(page, testInfo.project.name)
    await replaceProgram(page, 'print("latest source")')
    await expect(page.locator('.home-output-prompt')).toContainText('Press Run')
    release()
    await expect(page.locator('body')).toHaveAttribute('data-results', '1', { timeout: 120_000 })
    await expect(page.locator('body')).not.toHaveAttribute('data-terminated')
    await expect(page.locator('.home-term-status-ok')).toHaveCount(0)
    await expect(page.locator('.home-term')).not.toContainText('Guam: sample data')
    await page.locator('.home-editor-actions .home-run').click()
    await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser')
    await expect(page.locator('.home-term')).toContainText('latest source')
    await expect(page.locator('body')).toHaveAttribute('data-workers', '1')
    await expect(page.locator('body')).toHaveAttribute('data-results', '2')
  })
})

test('all seven examples fit phone code columns without wrapping or horizontal overflow', async ({ page }) => {
  test.setTimeout(180_000)
  for (const width of [360, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto('/', { waitUntil: 'networkidle' })
    const staticCode = page.locator('.home-code-scroller')
    expect(await staticCode.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
    await expect(staticCode).toHaveCSS('font-size', '16px')
    await expect(page.locator('.home-code-line').first()).toHaveCSS('white-space', 'pre')
    await expect(page.locator('.home-code-area')).not.toHaveAttribute('data-more-code')
    for (const example of PYTHON_EXAMPLES) {
      await page.getByRole('combobox', { name: /^Python example/ }).click()
      await page.getByRole('option', { name: example.filename, exact: true }).click()
      await expect(page.locator('.cm-content')).toBeVisible()
      await expect.poll(() => editorText(page)).toBe(example.code)
      await expect(page.locator('.cm-content')).toHaveCSS('font-size', '16px')
      await expect.poll(() => page.locator('.cm-scroller').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      expect(await page.locator('.cm-line').evaluateAll(lines => lines.every(line => line.getBoundingClientRect().height < parseFloat(getComputedStyle(line).lineHeight) * 1.1)), `${width}px ${example.filename} line heights`).toBe(true)
      await expect(page.locator('.home-code-area')).not.toHaveAttribute('data-more-code')
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    }
  }
})

test('a typed long line pans inside the phone editor and leaves the page and gutter fixed', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/', { waitUntil: 'networkidle' })
  // Stress the server-rendered line layout before the live typing journey.
  await page.locator('.home-code-line').first().evaluate(el => { el.textContent = 'x'.repeat(160) })
  const readOnly = page.locator('.home-code-scroller')
  const staticLeft = await page.locator('.home-code-num').first().evaluate(el => el.getBoundingClientRect().left)
  await expect(page.locator('.home-code-area')).toHaveAttribute('data-more-code', '')
  await readOnly.evaluate(el => { el.scrollLeft = 120 })
  expect(await readOnly.evaluate(el => el.scrollLeft)).toBeGreaterThan(100)
  expect(await page.locator('.home-code-num').first().evaluate(el => el.getBoundingClientRect().left)).toBeCloseTo(staticLeft, 0)
  await expect(page.locator('.home-code-num').first()).toHaveCSS('background-color', 'rgb(17, 24, 34)')
  await expect(page.locator('.home-code-num').first()).toHaveCSS('z-index', '4')
  await expect(page.locator('.home-code-num').first()).toHaveCSS('box-shadow', 'rgb(20, 27, 37) 4px 0px 0px 0px')
  expect(await page.locator('.home-code-line').first().evaluate(el => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight))).toBeCloseTo(1, 1)
  await page.reload({ waitUntil: 'networkidle' })
  await openEditor(page, testInfo.project.name)
  await replaceProgram(page, 'message = "' + 'A long Python line '.repeat(12) + '"')
  const scroller = page.locator('.cm-scroller')
  // Let CodeMirror finish revealing the newly typed caret before panning back.
  await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))))
  await scroller.evaluate(el => { el.scrollLeft = 0 })
  await expect(page.locator('.home-code-area')).toHaveAttribute('data-more-code', '')
  const before = await page.locator('.cm-gutters').boundingBox()
  await scroller.evaluate(el => { el.scrollLeft = 120 })
  expect(await scroller.evaluate(el => el.scrollLeft)).toBeGreaterThan(100)
  const after = await page.locator('.cm-gutters').boundingBox()
  expect(Math.abs(after!.x - before!.x)).toBeLessThan(1)
  await expect(page.locator('.cm-gutters')).toHaveCSS('background-color', 'rgb(17, 24, 34)')
  await expect(page.locator('.cm-gutters')).toHaveCSS('z-index', '200')
  await expect(page.locator('.cm-gutters')).toHaveCSS('box-shadow', 'rgb(20, 27, 37) 4px 0px 0px 0px')
  await expect(page.locator('.cm-lineNumbers')).toHaveCSS('background-color', 'rgb(17, 24, 34)')
  expect(await page.locator('.cm-line').count()).toBe(1)
  expect(await page.locator('.cm-line').evaluate(el => el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight))).toBeCloseTo(1, 1)
  expect(await scroller.evaluate(el => getComputedStyle(el).overscrollBehaviorX)).toBe('contain')
  expect(await scroller.evaluate(el => getComputedStyle(el).overscrollBehaviorY)).toBe('auto')
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBe(0)
  await shot(page, 'r7-long-line-sideways', testInfo.project.name, 'viewport')
})

test.describe('phone footer around automatic execution', () => {
  test.use({ saveData: false })

  test('Hafa Code stays clear of chat and receives taps before and after the first run', async ({ page }) => {
    test.setTimeout(180_000)
    await enableAutomaticRun(page)
    for (const [width, height] of [[375, 812], [390, 844]]) {
      await page.setViewportSize({ width, height })
      await page.goto('/', { waitUntil: 'networkidle' })
      const code = page.locator('.home-code-scroller')
      await expect(page.locator('.home-code-row')).toHaveCount(13)
      const checkCodeFits = async () => {
        expect(await code.evaluate(el => el.scrollHeight <= el.clientHeight + 1), `${width}×${height}: whole default program is visible`).toBe(true)
        expect(await code.evaluate(el => el.scrollWidth <= el.clientWidth), `${width}×${height}: default program fits across`).toBe(true)
      }
      await checkCodeFits()
      const link = page.locator('.home-editor-foot').getByRole('link', { name: /Open in Hafa Code/ })
      await link.scrollIntoViewIfNeeded()
      await expect(page.locator('.chat-launcher')).toHaveAttribute('data-visible', 'true')
      const check = async () => {
        const result = await link.evaluate(el => {
          const link = el.getBoundingClientRect()
          const chat = document.querySelector('.chat-launcher')!.getBoundingClientRect()
          const center = document.elementFromPoint(link.x + link.width / 2, link.y + link.height / 2)
          return {
            intersects: link.left < chat.right && link.right > chat.left && link.top < chat.bottom && link.bottom > chat.top,
            clickable: !!center && el.contains(center),
          }
        })
        expect(result.intersects).toBe(false)
        expect(result.clickable).toBe(true)
      }
      await check()
      await releaseIdle(page)
      await expect(page.locator('.home-term-status-ok')).toHaveText('Ran in browser', { timeout: 120_000 })
      expect(await page.locator('.home-term').evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
      await checkCodeFits()
      await check()
    }
  })
})
