const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const { JSDOM } = require('jsdom')

const routes = ['/', '/courses', '/courses/python-fundamentals', '/programs', '/curriculum', '/projects', '/internship', '/about', '/faq', '/interest', '/flappy-bird']
const pages = new Map(routes.map((route) => {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`
  return [route, fs.readFileSync(path.join('.next/server/app', file), 'utf8')]
}))

for (const [route, html] of pages) {
  test(`built ${route} has a usable landmark, title, and valid internal destinations`, () => {
    const doc = new JSDOM(html).window.document
    assert.ok(doc.title.length > 0)
    assert.equal(doc.querySelectorAll('main').length, 1)
    assert.ok(doc.querySelector('#main-content'))
    assert.ok(doc.querySelector('h1'))
    assert.ok(doc.querySelector('nav[aria-label="Main navigation"]'))
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

test('published offer surfaces preserve closed enrollment and unannounced bootcamp timing', () => {
  for (const route of ['/', '/courses', '/courses/python-fundamentals', '/programs', '/interest']) {
    const text = new JSDOM(pages.get(route)).window.document.querySelector('main').textContent
    assert.doesNotMatch(text, /January|February|2027/)
    assert.match(text, /invited|closed|not.*announced/i)
  }
  const doc = new JSDOM(pages.get('/')).window.document
  const schema = JSON.parse(doc.querySelector('script[type="application/ld+json"]').textContent)
  assert.doesNotMatch(JSON.stringify(schema), /under 6 months|six months/)
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
  // The clip is muted, inline, lazy, and its media exists.
  const video = main.querySelector('video')
  assert.ok(video, 'missing capstone clip')
  assert.ok(video.hasAttribute('loop') && video.hasAttribute('playsinline'))
  assert.equal(video.getAttribute('preload'), 'none')
  for (const src of [video.getAttribute('poster'), video.querySelector('source').getAttribute('src')]) {
    assert.ok(fs.existsSync(path.join('public', src)), `missing media ${src}`)
  }
  // Every image has alt text; photos of people are described, decorative avatars are empty.
  for (const img of main.querySelectorAll('img')) assert.ok(img.hasAttribute('alt'), `image without alt: ${img.getAttribute('src')}`)
  // Each section the header or CTAs link to exists.
  for (const id of ['path', 'work', 'teaching', 'stories', 'start']) assert.ok(doc.getElementById(id), `missing #${id}`)
})
