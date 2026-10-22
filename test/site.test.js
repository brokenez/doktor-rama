const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const vm = require('node:vm')
const { once } = require('node:events')
const { parseHTML } = require('linkedom')
const { createApp } = require('../server')
const schema = require('../content-schema')
const content = require('../site-content')
const legacy = require('../data.json')
const password = 'local-test-password'

async function fixture(t, initial = legacy, options = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'doktor-rama-test-'))
  const dataFile = path.join(directory, 'data.json')
  fs.writeFileSync(dataFile, JSON.stringify(initial))
  const settings = { dataFile, uploadsDir: path.join(directory, 'uploads'), adminPassword: password, fetch: async () => ({ ok: true }), ...options }
  const server = createApp(settings).listen(0, '127.0.0.1')
  await once(server, 'listening')
  t.after(async () => { await new Promise(resolve => server.close(resolve)); fs.rmSync(directory, { recursive: true, force: true }) })
  const origin = 'http://127.0.0.1:' + server.address().port
  const request = (url, body, headers = {}) => fetch(origin + url, { method: body === undefined ? 'GET' : 'POST', headers: { 'x-admin-token': password, ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...headers }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) })
  return { directory, dataFile, origin, request, settings }
}

test('главная, админка, изображения и JS доступны; служебные файлы закрыты', async t => {
  const app = await fixture(t)
  for (const url of ['/','/index.html','/admin.html','/content-schema.js','/site-content.js','/site.js','/admin.js','/logo.png','/favicon.ico','/assets/toyota.svg']) assert.equal((await app.request(url)).status, 200, url)
  assert.match(await (await app.request('/')).text(), /РЕМОНТ/)
  assert.equal((await fetch(app.origin + '/admin', { redirect: 'manual' })).headers.get('location'), '/admin.html')
  for (const url of ['/server.js','/data.json','/.env','/.git/config','/package.json']) assert.equal((await app.request(url)).status, 404, url)
})

test('старые записи и фотографии сохраняются, новые поля добавляются без сброса', async t => {
  const stored = structuredClone(legacy)
  stored.hero.desc = 'Сохранённое описание'
  stored.cases[0].image = '/uploads/existing.jpg'
  stored.reviews.push({ id: 99, name: 'Проверка', text: 'Сохранённый отзыв', car: 'УАЗ', stars: 4 })
  const app = await fixture(t, stored)
  const before = await (await app.request('/api/data')).json()
  assert.equal(before.hero.desc, stored.hero.desc)
  assert.deepEqual(before.cases, stored.cases)
  assert.deepEqual(before.reviews, stored.reviews)
  assert.equal(before.contacts.address, 'Шоссе Энтузиастов 2с41')
  assert.equal((await app.request('/api/admin/content', { contacts: { phone: '+7 (999) 111-22-33', address: 'Шоссе Энтузиастов 2с41' } })).status, 200)
  const after = JSON.parse(fs.readFileSync(app.dataFile, 'utf8'))
  assert.deepEqual(after.reviews, stored.reviews)
  assert.deepEqual(after.cases, stored.cases)
  assert.equal(after.hero.desc, stored.hero.desc)
  assert.equal(JSON.parse(fs.readFileSync(app.dataFile + '.bak', 'utf8')).hero.desc, stored.hero.desc)
  const restarted = createApp(app.settings).listen(0, '127.0.0.1'); await once(restarted, 'listening')
  try { assert.equal((await (await fetch('http://127.0.0.1:' + restarted.address().port + '/api/data')).json()).contacts.phone, '+7 (999) 111-22-33') }
  finally { await new Promise(resolve => restarted.close(resolve)) }
})

test('вход проверяет пароль, отсутствие ADMIN_PASSWORD не открывает запись', async t => {
  const app = await fixture(t)
  assert.equal((await app.request('/api/admin/login', { password })).status, 200)
  assert.equal((await app.request('/api/admin/login', { password: 'wrong' })).status, 401)
  assert.equal((await app.request('/api/admin/session')).status, 200)
  assert.equal((await app.request('/api/admin/content', { hero: { title: 'Сбой' } }, { 'x-admin-token': 'wrong' })).status, 401)
  const missing = await fixture(t, legacy, { adminPassword: '' })
  assert.equal((await missing.request('/')).status, 200)
  assert.equal((await missing.request('/api/admin/login', {})).status, 503)
  assert.equal((await fetch(missing.origin + '/api/admin/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ hero: { title: 'Сбой' } }) })).status, 503)
})

test('все 79 полей и все списки проходят сохранение и отображение', async t => {
  const app = await fixture(t)
  const patch = {}
  for (const field of schema.fields) {
    let value = 'Проверка: ' + field.label
    if (field.type === 'url') value = 'https://example.com/'
    if (field.type === 'image') value = '/uploads/check.png'
    if (field.type === 'email') value = 'test@example.com'
    content.set(patch, field.key, value)
  }
  for (const list of schema.lists) patch[list.key] = [{ id: 'check', ...Object.fromEntries(list.fields.map(field => [field.key, field.type === 'image' ? '/uploads/check.png' : field.type === 'checkbox' ? true : field.type === 'rating' ? 4 : 'Проверка ' + field.label])) }]
  assert.equal((await app.request('/api/admin/content', patch)).status, 200)
  const saved = await (await app.request('/api/data')).json()
  for (const field of schema.fields) assert.equal(content.get(saved, field.key), content.get(patch, field.key), field.key)
  const { document } = parseHTML(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'))
  content.renderSite(document, saved)
  for (const node of document.querySelectorAll('[data-cms]')) {
    const key = node.getAttribute('data-cms')
    assert.equal(node.textContent.replace(/\s/g, ''), String(content.get(saved, key)).replace(/\s/g, ''), key)
  }
  assert.equal(document.querySelector('.service-price').textContent, 'Проверка Стоимость услуги')
  assert.match(document.querySelector('[data-contact="address"]').textContent, /Проверка: Улица/)
  assert.equal(document.querySelector('.review-avatar img').getAttribute('src'), '/uploads/check.png')
  assert.equal(document.querySelector('.case-photo').getAttribute('src'), '/uploads/check.png')
  assert.match(document.querySelector('#service').textContent, /Проверка Название/)
  assert.match(document.querySelector('#footer-services').textContent, /Проверка Название/)
  assert.equal(JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent).address.streetAddress, saved.contacts.address)
  for (const list of schema.lists) assert.deepEqual(saved[list.key], patch[list.key])
})

test('пустые списки очищают контент, пользовательский текст не исполняется как HTML', async t => {
  const app = await fixture(t)
  const title = '<img src=x onerror="alert(1)">'
  assert.equal((await app.request('/api/admin/services', [{ id: 1, title, desc: '<script>bad()</script>', price: 'Бесплатно' }])).status, 200)
  const { document } = parseHTML(fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8'))
  content.renderSite(document, await (await app.request('/api/data')).json())
  assert.equal(document.querySelector('.service-title').textContent, title)
  assert.equal(document.querySelector('.service-title img'), null)
  assert.equal(document.querySelector('.service-desc script'), null)
  assert.equal((await app.request('/api/admin/content', { services: [], cases: [], reviews: [], aboutStats: [], aboutPoints: [], steps: [] })).status, 200)
  content.renderSite(document, await (await app.request('/api/data')).json())
  for (const id of ['services-grid','cases-grid','reviews-grid','about-stats','about-points','process-grid','footer-services']) assert.equal(document.getElementById(id).children.length, 0, id)
  for (const patch of [{ brand: { logo: 'javascript:alert(1)' } }, { reviews: [{ stars: 7 }] }, { unknown: 'value' }, JSON.parse('{"__proto__":{"polluted":true}}')]) assert.equal((await app.request('/api/admin/content', patch)).status, 400)
})

test('фотографии загружаются и сохраняются в работах и отзывах, неверные файлы отклоняются', async t => {
  const app = await fixture(t)
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64')
  const form = new FormData(); form.append('image', new Blob([png], { type: 'image/png' }), 'photo.png')
  const response = await fetch(app.origin + '/api/admin/upload', { method: 'POST', headers: { 'x-admin-token': password }, body: form })
  assert.equal(response.status, 200)
  const { url } = await response.json(); assert.match(url, /^\/uploads\/.+\.png$/)
  assert.equal((await app.request(url)).status, 200)
  const patch = { cases: [{ id: 1, title: 'Работа', tag: 'УАЗ', image: url, large: true }], reviews: [{ id: 1, name: 'Клиент', text: 'Отзыв', car: 'УАЗ', stars: 5, image: url }] }
  assert.equal((await app.request('/api/admin/content', patch)).status, 200)
  const saved = await (await app.request('/api/data')).json(); assert.equal(saved.cases[0].image, url); assert.equal(saved.reviews[0].image, url)
  const bad = new FormData(); bad.append('image', new Blob(['<html>bad</html>'], { type: 'image/png' }), 'fake.png')
  assert.equal((await fetch(app.origin + '/api/admin/upload', { method: 'POST', headers: { 'x-admin-token': password }, body: bad })).status, 400)
  assert.equal(fs.readdirSync(path.join(app.directory, 'uploads')).length, 1)
})

test('ошибка доставки заявки не маскируется успешным ответом', async t => {
  const app = await fixture(t, legacy, { fetch: async () => ({ ok: false }) })
  assert.equal((await app.request('/send', { name: 'Проверка', phone: '+7 (999) 111-22-33' })).status, 502)
  assert.equal((await app.request('/send', { name: '', phone: '' })).status, 400)
})

function adminDom(fetch) {
  const { document, window } = parseHTML(fs.readFileSync(path.join(__dirname, '../admin.html'), 'utf8'))
  // LinkeDOM does not implement the browser's writable select.value property.
  Object.defineProperty(window.HTMLSelectElement.prototype, 'value', { configurable: true,
    get() { return [...this.options].find(option => option.hasAttribute('selected'))?.value || this.options[0]?.value || '' },
    set(value) { for (const option of this.options) { if (option.value === String(value)) option.setAttribute('selected', ''); else option.removeAttribute('selected') } }
  })
  const memory = new Map()
  const storage = { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) }
  const context = vm.createContext({ document, window: { addEventListener() {} }, SiteSchema: schema, SiteContent: content, sessionStorage: storage, localStorage: storage, fetch, FormData, crypto: globalThis.crypto, confirm: () => true, console })
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../admin.js'), 'utf8'), context)
  return { document, window }
}
async function until(condition) { for (let i = 0; i < 100; i++) { if (condition()) return; await new Promise(resolve => setTimeout(resolve, 5)) } throw new Error('UI condition timed out') }

test('меню открывает все разделы, цена редактируется, несохранённые поля не теряются', async t => {
  const app = await fixture(t)
  const ui = adminDom((url, options) => fetch(app.origin + url, options))
  const { document, window } = ui
  const fire = (node, type) => node.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }))
  document.getElementById('password-input').value = password; fire(document.getElementById('login-form'), 'submit')
  await until(() => !document.getElementById('admin-screen').hidden)
  assert.equal(document.getElementById('section-select').options.length, schema.pages.length)
  for (const page of schema.pages) { document.getElementById('section-select').value = page.id; fire(document.getElementById('section-select'), 'change'); assert.equal(document.getElementById('page-title').textContent, page.title) }
  const select = document.getElementById('section-select'); select.value = 'services'; fire(select, 'change')
  const price = document.getElementById('services-0-price'); assert.equal(price.value, 'Бесплатно'); price.value = 'от 9 500 ₽'; fire(price, 'input')
  select.value = 'reviews'; fire(select, 'change'); select.value = 'services'; fire(select, 'change')
  assert.equal(document.getElementById('services-0-price').value, 'от 9 500 ₽')
  fire(document.getElementById('editor'), 'submit'); await until(() => document.getElementById('save-status').textContent.includes('сохранены'))
  assert.equal((await (await app.request('/api/data')).json()).services[0].price, 'от 9 500 ₽')
  select.value = 'reviews'; fire(select, 'change')
  const add = [...document.querySelectorAll('button')].find(node => node.textContent === '+ Добавить: отзыв'); fire(add, 'click')
  assert.equal(document.querySelectorAll('.item').length, legacy.reviews.length + 1)
})

test('админка показывает ошибку сохранения и оставляет изменения для повторной попытки', async () => {
  const ui = adminDom(async url => {
    if (url === '/api/admin/content') return { status: 500, ok: false, json: async () => ({ error: 'Ошибка записи' }) }
    return { status: 200, ok: true, json: async () => url === '/api/data' ? schema.defaults : { ok: true, token: password } }
  })
  const { document, window } = ui
  const fire = (node, type) => node.dispatchEvent(new window.Event(type, { bubbles: true, cancelable: true }))
  document.getElementById('password-input').value = password; fire(document.getElementById('login-form'), 'submit')
  await until(() => !document.getElementById('admin-screen').hidden)
  const title = document.getElementById('hero-title'); title.value = 'Новый заголовок'; fire(title, 'input')
  fire(document.getElementById('editor'), 'submit'); await until(() => document.getElementById('save-error').textContent)
  assert.equal(document.getElementById('save-status').textContent, '')
  assert.match(document.getElementById('dirty-status').textContent, /несохранённые/)
  assert.equal(document.getElementById('hero-title').value, 'Новый заголовок')
  assert.equal(document.getElementById('save-button').disabled, false)
})
