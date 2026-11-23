const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const { JSDOM } = require('jsdom')

const routes = ['/', '/courses', '/courses/python-fundamentals', '/partners', '/programs', '/curriculum', '/projects', '/internship', '/about', '/faq', '/interest', '/flappy-bird']
const pages = new Map(routes.map((route) => {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
  return [route, fs.readFileSync(path.join('.next/server/app', file), 'utf8')]
}))

for (const [route, html] of pages) {
  test(`built ${route} has a usable landmark, title, social metadata, and valid internal destinations`, () => {
    const doc = new JSDOM(html).window.document
    assert.ok(doc.title.length > 0)
    assert.equal(doc.querySelectorAll('main').length, 1)
    assert.equal(doc.querySelectorAll('header').length, 1, `${route}: expected exactly one header`)
    assert.ok(doc.querySelector('#main-content'))
    assert.ok(doc.querySelector('h1'))
    assert.ok(doc.querySelector('nav[aria-label="Main navigation"]'))
    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
    const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
    assert.match(ogImage || '', /\/images\/code-school-social-card\.png$/, `${route}: missing og:image`)
    assert.match(twitterImage || '', /\/images\/code-school-social-card\.png$/, `${route}: missing twitter:image`)
    for (const a of doc.querySelectorAll('a[href^="/"]')) {
      const href = a.getAttribute('href')
      if (href.startsWith('//')) continue
      const url = new URL(href, 'https://codeschoolofguam.com')
      assert.ok(pages.has(url.pathname), `${route}: unknown local route ${href}`)
      if (url.hash) {
        const destination = new JSDOM(pages.get(url.pathname)).window.document
        assert.ok(destination.getElementById(decodeURIComponent(url.hash.slice(1))), `${route}: missing anchor ${href}`)
      }
    }
    for (const img of doc.querySelectorAll('img[src^="/"]')) {
      const src = new URL(img.getAttribute('src'), 'https://codeschoolofguam.com')
      // Optimized images point at /_next/image?url=<public path>; check the original asset.
      const asset = src.pathname === '/_next/image' ? src.searchParams.get('url') : src.pathname
      assert.ok(asset && fs.existsSync(path.join('public', asset)), `${route}: missing image ${img.getAttribute('src')}`)
    }
  })
}

test('published offer surfaces preserve closed enrollment, early 2027 pilot wording, and unannounced bootcamp timing', () => {
  for (const route of ['/', '/courses', '/courses/python-fundamentals', '/programs', '/interest', '/faq']) {
    const text = new JSDOM(pages.get(route)).window.document.querySelector('main').textContent
    assert.doesNotMatch(text, /December 2026|January|February/)
    assert.match(text, /invited|closed|not.*announced/i)
  }
  for (const route of ['/', '/courses', '/courses/python-fundamentals', '/programs', '/faq']) {
    const text = new JSDOM(pages.get(route)).window.document.querySelector('main').textContent
    assert.match(text, /early 2027/i, `${route}: expected early 2027 pilot wording`)
  }
  const interestText = new JSDOM(pages.get('/interest')).window.document.querySelector('main').textContent
  assert.doesNotMatch(interestText, /2027/)

  const doc = new JSDOM(pages.get('/')).window.document
  const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)
  assert.doesNotMatch(JSON.stringify(schema), /under 6 months|six months|December 2026/)
  assert.equal(schema.address.addressRegion, 'GU')
  assert.equal(schema.telephone, '+1-671-483-0219')
  assert.equal(schema.areaServed, 'Guam')
})

test('self-paced descriptions reflect instructor project review, and CSG Learn naming is consistent', () => {
  for (const route of ['/courses', '/courses/python-fundamentals', '/faq']) {
    const text = new JSDOM(pages.get(route)).window.document.querySelector('main').textContent
    assert.doesNotMatch(text, /without private Zoom meetings or individual project review|Private Zoom meetings and individual project review are not included/i)
    assert.match(text, /instructor review/i, `${route}: expected self-paced instructor review wording`)
  }
  const projectsText = new JSDOM(pages.get('/projects')).window.document.querySelector('main').textContent
  assert.doesNotMatch(projectsText, /CSG Learning Hub/)
  assert.match(projectsText, /CSG Learn/)
  const homeDoc = new JSDOM(pages.get('/')).window.document
  assert.ok(homeDoc.querySelector('header a[href="https://learn.codeschoolofguam.com/"]'), 'missing CSG Learn link in header')
  assert.ok(homeDoc.querySelector('footer a[href="https://learn.codeschoolofguam.com/"]'), 'missing CSG Learn link in footer')
})

test('/faq emits FAQPage structured data and /flappy-bird has clean single-chrome layout', () => {
  const faqDoc = new JSDOM(pages.get('/faq')).window.document
  const scripts = Array.from(faqDoc.querySelectorAll('script[type="application/ld+json"]')).map((el) => JSON.parse(el.textContent))
  const faqSchema = scripts.find((entry) => entry['@type'] === 'FAQPage')
  assert.ok(faqSchema, 'missing FAQPage JSON-LD on /faq')
  assert.ok(Array.isArray(faqSchema.mainEntity) && faqSchema.mainEntity.length >= 20)

  const flappyDoc = new JSDOM(pages.get('/flappy-bird')).window.document
  assert.equal(flappyDoc.querySelectorAll('header').length, 1)
  assert.equal(flappyDoc.querySelectorAll('footer').length, 1)
  assert.doesNotMatch(flappyDoc.body.textContent, /2025 Code School/)
  // Heading levels inside main must not skip from h1 directly to h3.
  const headings = Array.from(flappyDoc.querySelectorAll('main h1, main h2, main h3, main h4')).map((el) => Number(el.tagName[1]))
  assert.equal(headings[0], 1)
  for (let i = 1; i < headings.length; i++) {
    assert.ok(headings[i] <= headings[i - 1] + 1, `/flappy-bird skipped heading level h${headings[i - 1]} -> h${headings[i]}`)
  }
})

test('custom 404 page renders branded navigation links without canonical or og:url pointing to /', () => {
  const notFoundHtml = fs.readFileSync(path.join('.next/server/app/_not-found.html'), 'utf8')
  const doc = new JSDOM(notFoundHtml).window.document
  const main = doc.querySelector('main')
  assert.ok(main, 'missing main on 404 page')
  assert.ok(main.querySelector('a[href="/"]'), '404 missing home link')
  assert.ok(main.querySelector('a[href="/courses"]'), '404 missing courses link')
  assert.ok(main.querySelector('a[href="/programs"]'), '404 missing programs link')
  assert.equal(doc.querySelector('link[rel="canonical"]'), null, '404 should not emit canonical')
  assert.equal(doc.querySelector('meta[property="og:url"]'), null, '404 should not emit og:url')

  const homeDoc = new JSDOM(pages.get('/')).window.document
  assert.equal(homeDoc.querySelector('link[rel="canonical"]')?.getAttribute('href'), 'https://codeschoolofguam.com')
  assert.equal(homeDoc.querySelector('meta[property="og:url"]')?.getAttribute('content'), 'https://codeschoolofguam.com')
})

test('security headers are configured in Next.js routes manifest for all HTML and asset paths', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join('.next', 'routes-manifest.json'), 'utf8'))
  const catchAll = (manifest.headers || []).find((entry) => entry.source === '/:path*')
  assert.ok(catchAll, 'missing /:path* headers entry in routes-manifest.json')
  const byKey = new Map(catchAll.headers.map((h) => [h.key, h.value]))
  assert.equal(byKey.get('X-Frame-Options'), 'DENY')
  assert.equal(byKey.get('Referrer-Policy'), 'strict-origin-when-cross-origin')
  assert.equal(byKey.get('Permissions-Policy'), 'camera=(), microphone=(), geolocation=()')
})

test('built CSS resolves every form <select> to an explicit >= 48px height for WebKit', () => {
  const cssDir = path.join('.next', 'static', 'css')
  const cssText = fs.readdirSync(cssDir)
    .filter((file) => file.endsWith('.css'))
    .map((file) => fs.readFileSync(path.join(cssDir, file), 'utf8'))
    .join('\n')
  const spacingMatch = cssText.match(/--spacing:\s*([\d.]+)rem/)
  const spacingPx = spacingMatch ? parseFloat(spacingMatch[1]) * 16 : 4

  function resolveExplicitHeightPx(el) {
    for (const cls of Array.from(el.classList).reverse()) {
      const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const rule = cssText.match(new RegExp(`\\.${escaped}\\s*\\{[^}]*?\\bheight:\\s*([^;!}]+)`))
      if (!rule) continue
      const val = rule[1].trim()
      const calcSpacing = val.match(/calc\(var\(--spacing\)\s*\*\s*([\d.]+)\)/)
      if (calcSpacing) return parseFloat(calcSpacing[1]) * spacingPx
      const rem = val.match(/^([\d.]+)rem$/)
      if (rem) return parseFloat(rem[1]) * 16
      const px = val.match(/^([\d.]+)px$/)
      if (px) return parseFloat(px[1])
    }
    return null
  }

  for (const route of ['/interest', '/courses', '/courses/python-fundamentals', '/partners']) {
    const doc = new JSDOM(pages.get(route)).window.document
    const selects = Array.from(doc.querySelectorAll('select'))
    assert.ok(selects.length > 0, `${route}: expected select fields`)
    for (const select of selects) {
      const resolvedPx = resolveExplicitHeightPx(select)
      assert.ok(resolvedPx !== null && resolvedPx >= 48, `${route} select[name="${select.getAttribute('name')}"] resolved explicit height ${resolvedPx}px (expected >= 48px)`)
    }
  }
})

test('/policies permanently redirects to the FAQ tuition and policies section', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join('.next', 'routes-manifest.json'), 'utf8'))
  const redirect = manifest.redirects.find((entry) => entry.source === '/policies')
  assert.ok(redirect, 'missing /policies redirect')
  assert.equal(redirect.statusCode, 301)
  const destination = new URL(redirect.destination, 'https://codeschoolofguam.com')
  assert.equal(destination.pathname, '/faq')
  const faq = new JSDOM(pages.get('/faq')).window.document
  const section = faq.getElementById(destination.hash.slice(1))
  assert.ok(section, `missing anchor ${redirect.destination}`)
  assert.match(section.textContent, /Tuition and policies/)
  assert.match(section.textContent, /What did the March 2026 bootcamp cost\?/)
  assert.doesNotMatch(faq.querySelector('main').textContent, /Why is the tuition set/)
})

test('each interest form is introduced by a heading that names its offer', () => {
  const expectations = [
    ['/courses', 'focused-courses-interest', /focused-course updates/i],
    ['/courses/python-fundamentals', 'python-fundamentals-interest', /Python Fundamentals updates/],
    ['/interest', 'next-cohort-interest', /full bootcamp updates/i],
    ['/partners', 'partner-inquiry', /partner conversation/i],
  ]
  for (const [route, formName, heading] of expectations) {
    const doc = new JSDOM(pages.get(route)).window.document
    const form = doc.querySelector(`form[name="${formName}"]`)
    assert.ok(form, `${route}: missing ${formName}`)
    let card = form.parentElement
    while (card && !card.querySelector('h2, h3')) card = card.parentElement
    assert.ok(card, `${route}: no heading near ${formName}`)
    assert.match(card.querySelector('h2, h3').textContent, heading)
  }
})

test('the /courses hero offers a course-updates action that is visible on phones', () => {
  const doc = new JSDOM(pages.get('/courses')).window.document
  const hero = doc.querySelector('main section')
  const cta = Array.from(hero.querySelectorAll('a')).find((a) => a.getAttribute('href') === '#course-interest')
  assert.ok(cta, 'missing hero course-updates link')
  assert.match(cta.textContent, /Get course updates/)
  assert.doesNotMatch(cta.className + ' ' + cta.parentElement.className, /(^|\s)hidden(\s|$)/)
  assert.ok(doc.getElementById('course-interest'))
})

test('the homepage keeps reviewed claims, real media, and no concept-review aids', () => {
  const doc = new JSDOM(pages.get('/')).window.document
  const main = doc.querySelector('main')
  const text = main.textContent
  // Graduate teaching line must stay consistent with the chatbot's reviewed knowledge.
  const about = fs.readFileSync(path.join('data/knowledge/about.md'), 'utf8')
  assert.match(about, /Audreana Crane is a CSG graduate who teaches introductory coding at Father Dueñas Memorial School/)
  assert.match(text, /Audreana, a Cohort 1 graduate, now teaches a beginner version of the course at Father Dueñas Memorial School\./)
  // Static stats match /projects (6 + 5 graduates across two 2025 cohorts).
  const projects = new JSDOM(pages.get('/projects')).window.document.querySelector('main').textContent
  assert.match(projects, /11 graduates across Cohorts 1 and 2/)
  for (const stat of ['11', '100%']) assert.ok(Array.from(main.querySelectorAll('.home-stats dd')).some((dd) => dd.textContent === stat), `missing stat ${stat}`)
  // Review aids from the concept mockup are not shipped.
  assert.doesNotMatch(text, /Concept|Motion on|Notes on|mockup/i)
  // The clip is muted, inline, metadata-preloaded with underlying poster image, and its media exists.
  const video = main.querySelector('video')
  assert.ok(video, 'missing capstone clip')
  assert.ok(video.hasAttribute('loop') && video.hasAttribute('playsinline'))
  assert.equal(video.getAttribute('preload'), 'metadata')
  assert.equal(video.hasAttribute('poster'), false, 'video should rely on underlying poster Image without duplicate poster attribute')
  const posterImg = main.querySelector('img.home-live-poster')
  assert.ok(posterImg, 'missing underlying capstone poster image')
  const posterUrl = new URL(posterImg.getAttribute('src'), 'https://codeschoolofguam.com')
  const posterAsset = posterUrl.pathname === '/_next/image' ? posterUrl.searchParams.get('url') : posterUrl.pathname
  for (const src of [posterAsset, video.querySelector('source').getAttribute('src')]) {
    assert.ok(fs.existsSync(path.join('public', src)), `missing media ${src}`)
  }
  // Every image has alt text; photos of people are described, decorative avatars are empty.
  for (const img of main.querySelectorAll('img')) assert.ok(img.hasAttribute('alt'), `image without alt: ${img.getAttribute('src')}`)
  // Each section the header or CTAs link to exists.
  for (const id of ['path', 'work', 'teaching', 'stories', 'partners', 'start']) assert.ok(doc.getElementById(id), `missing #${id}`)
  // On-demand Python Web Worker exists in public/workers/.
  assert.ok(fs.existsSync(path.join('public', 'workers', 'python-runner.js')), 'missing public/workers/python-runner.js')
})

test('/partners and /projects ship verified Guam proof and named graduate capstones', () => {
  const partnersDoc = new JSDOM(pages.get('/partners')).window.document
  const partnersMain = partnersDoc.querySelector('main')
  const partnersText = partnersMain.textContent
  for (const proof of ['University of Guam', 'Audreana Crane', 'Father Dueñas', 'Alanna Cruz', 'DMR', 'Shimizu Technology', '11 graduates', 'CSG Learn tracks Cohort 3 onward', 'September 2026']) {
    assert.ok(partnersText.includes(proof), `/partners missing verified proof: ${proof}`)
  }
  assert.doesNotMatch(partnersText, /sponsored seats|1–2 business days|direct introductions/i)
  // Never ship Father Dueñas student photos.
  for (const img of partnersMain.querySelectorAll('img')) {
    assert.doesNotMatch(img.getAttribute('src') || '', /fd|father-duenas/i)
    assert.doesNotMatch(img.getAttribute('alt') || '', /father dueñas|fd students/i)
  }

  const projectsDoc = new JSDOM(pages.get('/projects')).window.document
  const projectsMain = projectsDoc.querySelector('main')
  const projectsText = projectsMain.textContent
  const projectLinks = Array.from(projectsMain.querySelectorAll('a')).map((a) => a.getAttribute('href'))
  for (const [name, href] of [
    ['BlueStar: Micronesian Wayfinding', 'https://www.youtube.com/watch?v=bWuS_YuiRzI&t=2223s'],
    ['Shared Shores GU', 'https://www.youtube.com/watch?v=bWuS_YuiRzI&t=3627s'],
    ['Indecisive', 'https://www.youtube.com/watch?v=MNzZeL33jiw&t=739s'],
    ['The Weekly Dish', 'https://www.youtube.com/watch?v=MNzZeL33jiw&t=3436s'],
  ]) {
    assert.ok(projectsText.includes(name), `/projects missing capstone ${name}`)
    assert.ok(projectLinks.includes(href), `/projects missing timestamp link ${href}`)
  }

  // Server-rendered /courses/python-fundamentals Hafa Code link must encode the real Python sample (not a client proxy).
  const pyDoc = new JSDOM(pages.get('/courses/python-fundamentals')).window.document
  const hafaLink = Array.from(pyDoc.querySelectorAll('a')).find((a) => /Open in Hafa Code/i.test(a.textContent || ''))
  assert.ok(hafaLink, '/courses/python-fundamentals missing Open in Hafa Code link')
  const href = hafaLink.getAttribute('href') || ''
  assert.match(href, /^https:\/\/code\.shimizu-technology\.com\/\?lang=python#/)
  const hashParams = new URLSearchParams(href.split('#')[1])
  assert.equal(hashParams.get('starter'), 'csg-site-expense-summary')
  const decoded = JSON.parse(Buffer.from(hashParams.get('project'), 'base64url').toString('utf8'))
  assert.equal(decoded.kind, 'python')
  assert.equal(decoded.entryPath, 'expense_summary.py')
  assert.match(decoded.files[0].content, /^expenses = \{/)
  assert.ok(decoded.files[0].content.includes('label = "Under budget by"'))
  assert.ok(decoded.files[0].content.includes('print(label, f"${left}")'))
})

test('built / ships highlighted hero code with no editor JavaScript, and the lazy editor chunk stays under 150 KB gzipped', () => {
  const zlib = require('node:zlib')
  const html = pages.get('/')
  const doc = new JSDOM(html).window.document
  const code = doc.querySelector('.home-code-static')
  assert.ok(code, '/: missing server-rendered hero code')
  assert.ok(code.querySelectorAll('[class^="home-tok-"]').length >= 20, '/: hero code is not syntax-highlighted')

  const chunksDir = path.join('.next', 'static', 'chunks')
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))
  const initial = new Set([...html.matchAll(/\/_next\/static\/chunks\/([^"?]+\.js)/g)].map((m) => path.join(chunksDir, m[1])))
  const isEditorCode = (src) => /cm-gutterElement|FormatReplacement|placeCursorAtEnd\([^)]*\)\{/.test(src)
  for (const file of initial) assert.ok(!isEditorCode(fs.readFileSync(file, 'utf8')), `/: first-load chunk ${file} contains CodeMirror`)
  const lazy = walk(chunksDir).filter((f) => f.endsWith('.js') && !initial.has(f) && isEditorCode(fs.readFileSync(f, 'utf8')))
  assert.ok(lazy.length > 0, 'lazy editor chunk not found')
  const gzipped = lazy.reduce((sum, f) => sum + zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length, 0)
  assert.ok(gzipped <= 150 * 1024, `lazy editor chunks are ${(gzipped / 1024).toFixed(1)} KB gzipped (budget 150 KB)`)
})
