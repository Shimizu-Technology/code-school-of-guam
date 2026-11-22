import { expect, test, type Page } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

const SHOTS = process.env.E2E_SHOTS_DIR ?? path.join('test-results', 'hero-editor')
fs.mkdirSync(SHOTS, { recursive: true })

const isTouch = (projectName: string) => projectName !== 'desktop-chrome'
/** CodeMirror treats iOS like macOS (Cmd shortcuts); elsewhere Ctrl/Cmd follows the host. */
const mod = () => (test.info().project.name.includes('iphone') ? 'Meta' : 'ControlOrMeta')

async function shot(page: Page, name: string, projectName: string, target: 'editor' | 'viewport' = 'editor') {
  const file = path.join(SHOTS, `${projectName}-${name}.png`)
  if (target === 'editor') await page.locator('figure.home-editor').screenshot({ path: file })
  else await page.screenshot({ path: file })
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
  const button = page.getByRole('button', { name: 'Write your own' })
  if (isTouch(projectName)) await button.tap()
  else await button.click()
  await expect(page.locator('.cm-content')).toBeVisible()
  await expect.poll(() => focusedInEditor(page)).toBe(true)
}

test.beforeEach(async ({ page }) => {
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
  const code = page.getByRole('region', { name: 'Sample Python code: expense_summary.py' })
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
    if (body && /cm-gutterElement|highlightTree|FormatReplacement/.test(body.toString())) editorChunks.push(body.length)
  })
  await page.goto('/', { waitUntil: 'networkidle' })
  const region = page.getByRole('region', { name: 'Sample Python code: expense_summary.py' })
  await region.scrollIntoViewIfNeeded()
  const before = await page.evaluate(() => ({
    lines: Array.from(document.querySelectorAll('.home-code-line')).map((el) => {
      const r = el.getBoundingClientRect()
      return [Math.round((r.top + window.scrollY) * 10) / 10, Math.round(r.height * 10) / 10]
    }),
    area: Math.round(document.querySelector('.home-code-area')!.getBoundingClientRect().height),
    color: getComputedStyle(document.querySelector('.home-code-static .home-tok-f')!).color,
  }))
  // Tap the word "left" on line 14.
  const target = region.locator('.home-code-row').nth(13)
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
  expect(after.cursorLine).toBe(14)
  const gz = editorChunks.reduce((a, b) => a + b, 0)
  testInfo.annotations.push({ type: 'editor-chunk-transfer-bytes', description: String(gz) })
  console.log(`[${testInfo.project.name}] editor chunks loaded on tap: ${editorChunks.length} files, ${(gz / 1024).toFixed(1)} KB transferred (decoded body sizes)`)
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
  const reset = page.getByRole('button', { name: 'Reset to default Python example' })
  if (isTouch(testInfo.project.name)) await reset.tap()
  else await reset.click()
  await expect.poll(() => editorText(page)).toContain('for item, cost in expenses.items():')
  await expect(term).toContainText('Under budget by $2')
  // Reset is undoable.
  if (isTouch(testInfo.project.name)) {
    await page.locator('.cm-content').focus()
    await page.getByRole('toolbar', { name: 'Coding keys' }).getByRole('button', { name: 'Undo' }).tap()
  } else {
    await page.keyboard.press(`${mod()}+z`)
  }
  await expect.poll(() => editorText(page)).toContain('Hafa adai')
})

test('long lines wrap inside the editor and a 60-line program scrolls inside a bounded box', async ({ page }, testInfo) => {
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
  expect(m.scrollerOverflowX).toBeLessThanOrEqual(1)
  expect(m.scrolls).toBe(true)
  expect(m.height).toBeLessThanOrEqual(Math.min(34 * 16, m.innerHeight * 0.75) + 1)
  expect(m.misaligned).toBe(0)
  expect(m.wrappedLongLine).toBe(true)
  expect(m.hang).not.toBe('0px')
  await page.locator('.cm-scroller').evaluate((el) => { el.scrollTop = 0 })
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
  await page.getByRole('button', { name: 'Write your own' }).tap()
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
    await page.getByRole('button', { name: 'Write your own' }).tap()
    await page.keyboard.insertText('\nprint("pending")')
    if (reset) await page.getByRole('button', { name: 'Reset to default Python example' }).tap()
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
