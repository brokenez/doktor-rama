const express = require('express')
const fs = require('node:fs')
const path = require('node:path')
const crypto = require('node:crypto')
const multer = require('multer')
require('dotenv').config()
const schema = require('./content-schema')
const { merge, safeUrl } = require('./site-content')

function createApp(options = {}) {
  const app = express()
  const dataFile = options.dataFile || process.env.DATA_FILE || path.join(__dirname, 'data.json')
  const uploadsDir = options.uploadsDir || process.env.UPLOADS_DIR || path.join(__dirname, 'public', 'uploads')
  const adminPassword = options.adminPassword ?? process.env.ADMIN_PASSWORD
  fs.mkdirSync(uploadsDir, { recursive: true })
  app.disable('x-powered-by')
  app.use(express.json({ limit: '2mb' }))
  app.use('/api', (req, res, next) => { res.set('Cache-Control', 'no-store'); next() })

  // Serve only public files; never expose the repository or .env as a static root.
  const rootFiles = ['index.html','admin.html','content-schema.js','site-content.js','site.js','admin.js','logo.png','favicon.ico','favicon-16x16.png','favicon-32x32.png','apple-touch-icon.png','robots.txt','sitemap.xml','yandex_cf6d0472af72f1bd.html']
  app.get('/', (req, res) => { res.set('Cache-Control', 'no-cache'); res.sendFile(path.join(__dirname, 'index.html')) })
  for (const file of rootFiles) app.get('/' + file, (req, res) => { res.set('Cache-Control', 'no-cache'); res.sendFile(path.join(__dirname, file)) })
  app.get('/admin', (req, res) => res.redirect('/admin.html'))
  app.use('/assets', express.static(path.join(__dirname, 'assets')))
  app.use('/uploads', express.static(uploadsDir, { dotfiles: 'deny', setHeaders(res) { res.setHeader('X-Content-Type-Options', 'nosniff') } }))
  app.use(express.static(path.join(__dirname, 'public'), { dotfiles: 'deny' }))

  function readData() {
    const source = fs.existsSync(dataFile) ? dataFile : path.join(__dirname, 'data.json')
    const stored = fs.existsSync(source) ? JSON.parse(fs.readFileSync(source, 'utf8')) : {}
    if (!stored || Array.isArray(stored) || typeof stored !== 'object') throw new Error('Invalid data file')
    return merge(schema.defaults, stored)
  }
  function writeData(data) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true })
    const temporary = dataFile + '.' + crypto.randomUUID() + '.tmp'
    try {
      fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
      if (fs.existsSync(dataFile)) fs.copyFileSync(dataFile, dataFile + '.bak')
      fs.renameSync(temporary, dataFile)
    } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary) }
  }
  function matchesPassword(value) {
    if (typeof value !== 'string' || !adminPassword) return false
    const actual = Buffer.from(value), expected = Buffer.from(adminPassword)
    return actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
  }
  function auth(req, res, next) {
    if (!adminPassword) return res.status(503).json({ error: 'На сервере не настроен пароль администратора ADMIN_PASSWORD.' })
    if (!matchesPassword(req.get('x-admin-token'))) return res.status(401).json({ error: 'Unauthorized' })
    next()
  }
  const fieldMap = new Map(schema.fields.map(field => [field.key, field]))
  const listMap = new Map(schema.lists.map(list => [list.key, list]))
  function validateValue(value, field) {
    if (field.type === 'checkbox') return typeof value === 'boolean'
    if (field.type === 'rating') return Number.isInteger(value) && value >= 1 && value <= 5
    if (typeof value !== 'string' || value.length > 20000) return false
    if (['url','image'].includes(field.type) && value && !safeUrl(value, field.type === 'image')) return false
    return true
  }
  function validatePatch(patch) {
    if (!patch || typeof patch !== 'object' || Array.isArray(patch) || !Object.keys(patch).length) return false
    function visit(value, key) {
      if (fieldMap.has(key)) return validateValue(value, fieldMap.get(key))
      if (listMap.has(key)) {
        const definition = listMap.get(key)
        return Array.isArray(value) && value.length <= 200 && value.every(item => {
          if (!item || typeof item !== 'object' || Array.isArray(item)) return false
          return Object.keys(item).every(property => property === 'id'
            ? ['string','number'].includes(typeof item.id)
            : definition.fields.some(field => field.key === property && validateValue(item[property], field)))
        })
      }
      if (!value || typeof value !== 'object' || Array.isArray(value) || !Object.keys(value).length) return false
      return Object.entries(value).every(([part, nested]) => !['__proto__','constructor','prototype'].includes(part) && visit(nested, key ? key + '.' + part : part))
    }
    return visit(patch, '')
  }
  function savePatch(req, res, patch) {
    if (!validatePatch(patch)) return res.status(400).json({ error: 'Проверьте значения полей: ссылки должны начинаться с https://, оценка — от 1 до 5.' })
    const data = merge(readData(), patch)
    writeData(data)
    res.json({ ok: true })
  }
  app.get('/api/data', (req, res) => res.json(readData()))
  app.get('/api/admin/session', auth, (req, res) => res.json({ ok: true }))
  app.post('/api/admin/login', (req, res) => {
    if (!adminPassword) return res.status(503).json({ error: 'На сервере не настроен пароль администратора ADMIN_PASSWORD.' })
    if (!matchesPassword(req.body?.password)) return res.status(401).json({ error: 'Wrong password' })
    res.json({ ok: true, token: req.body.password })
  })
  app.post('/api/admin/content', auth, (req, res) => savePatch(req, res, req.body))
  // Keep the existing endpoints for clients with an older admin page in cache.
  for (const section of ['hero','services','cases','reviews','contacts']) app.post('/api/admin/' + section, auth, (req, res) => savePatch(req, res, { [section]: req.body }))

  const types = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif' }
  const upload = multer({
    storage: multer.diskStorage({ destination: uploadsDir, filename(req, file, done) { done(null, crypto.randomUUID() + types[file.mimetype]) } }),
    limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter(req, file, done) { if (types[file.mimetype]) done(null, true); else done(new Error('IMAGE_TYPE')) }
  })
  app.post('/api/admin/upload', auth, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Выберите фотографию для загрузки.' })
    const bytes = fs.readFileSync(req.file.path).subarray(0, 16)
    const mime = req.file.mimetype
    const valid = mime === 'image/jpeg' ? bytes.subarray(0, 3).equals(Buffer.from([255,216,255]))
      : mime === 'image/png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
      : mime === 'image/gif' ? ['GIF87a','GIF89a'].includes(bytes.subarray(0, 6).toString())
      : mime === 'image/webp' && bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP'
    if (!valid) { fs.unlinkSync(req.file.path); return res.status(400).json({ error: 'Файл не является фотографией JPG, PNG, WebP или GIF.' }) }
    res.json({ ok: true, url: '/uploads/' + req.file.filename })
  })
  app.post('/send', async (req, res) => {
    const { name, phone, car, service, message } = req.body || {}
    if (typeof name !== 'string' || !name.trim() || typeof phone !== 'string' || phone.replace(/\D/g, '').length < 10) return res.status(400).json({ error: 'Укажите имя и телефон.' })
    const lines = ['🔧 Новая заявка — Доктор Рама', '👤 Имя: ' + name, '📞 Телефон: ' + phone]
    for (const [label, value] of [['🚗 Автомобиль',car],['🛠 Услуга',service],['💬 Сообщение',message]]) if (typeof value === 'string' && value) lines.push(label + ': ' + value)
    try {
      const response = await (options.fetch || fetch)('https://little-mud-f09f.relative777.workers.dev', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: lines.join('\n') }), signal: AbortSignal.timeout(15000) })
      if (!response.ok) throw new Error('Delivery failed')
      res.json({ ok: true })
    } catch { res.status(502).json({ error: 'Не удалось доставить заявку. Позвоните нам.' }) }
  })
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error)
    const uploadError = error instanceof multer.MulterError || error.message === 'IMAGE_TYPE'
    const status = uploadError || error.type === 'entity.parse.failed' ? 400 : error.status === 413 ? 413 : 500
    if (status === 500) console.error('Ошибка приложения:', error.code || error.message)
    res.status(status).json({ error: uploadError ? 'Выберите JPG, PNG, WebP или GIF размером до 10 МБ.' : status === 400 ? 'Некорректный запрос.' : status === 413 ? 'Слишком большой объём данных.' : 'Не удалось прочитать или сохранить данные. Проверьте настройки приложения на хостинге.' })
  })
  return app
}

if (require.main === module) createApp().listen(process.env.PORT || 3000, () => console.log('Доктор Рама: сервер запущен'))
module.exports = { createApp }
