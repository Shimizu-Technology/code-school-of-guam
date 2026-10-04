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
      assert.ok(fs.existsSync(path.join('public', img.getAttribute('src'))), `${route}: missing image ${img.getAttribute('src')}`)
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
