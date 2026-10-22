const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
app.use(express.json())
require('dotenv').config()

const DATA_FILE = path.join(__dirname, 'data.json')
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads')

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

app.use(express.static(path.join(__dirname, 'public')))

function readData() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')) }
  catch { return {} }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
}

function auth(req, res, next) {
  const token = req.headers['x-admin-token']
  if (token !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Unauthorized' })
  next()
}

app.get('/api/data', (req, res) => res.json(readData()))

app.post('/send/', async (req, res) => {
  const { name, phone, car, service, message } = req.body
  const lines = ['\uD83D\uDD27 \u041D\u043E\u0432\u0430\u044F \u0437\u0430\u044F\u0432\u043A\u0430 \u2014 \u0414\u043E\u043A\u0442\u043E\u0440 \u0420\u0430\u043C\u0430', '\uD83D\uDC64 \u0418\u043C\u044F: ' + name, '\uD83D\uDCDE \u0422\u0435\u043B\u0435\u0444\u043E\u043D: ' + phone]
  if (car) lines.push('\uD83D\uDE97 \u0410\u0432\u0442\u043E\u043C\u043E\u0431\u0438\u043B\u044C: ' + car)
  if (service) lines.push('\uD83D\uDEE0 \u0423\u0441\u043B\u0443\u0433\u0430: ' + service)
  if (message) lines.push('\uD83D\uDCAC \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435: ' + message)
  await fetch('https://little-mud-f09f.relative777.workers.dev', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lines.join('\n') })
  })
  res.json({ ok: true })
})

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password === process.env.ADMIN_PASSWORD) res.json({ ok: true, token: password })
  else res.status(401).json({ error: 'Wrong password' })
})

app.post('/api/admin/hero', auth, (req, res) => {
  const data = readData(); data.hero = { ...data.hero, ...req.body }; writeData(data); res.json({ ok: true })
})

app.post('/api/admin/services', auth, (req, res) => {
  const data = readData(); data.services = req.body; writeData(data); res.json({ ok: true })
})

app.post('/api/admin/cases', auth, (req, res) => {
  const data = readData(); data.cases = req.body; writeData(data); res.json({ ok: true })
})

app.post('/api/admin/reviews', auth, (req, res) => {
  const data = readData(); data.reviews = req.body; writeData(data); res.json({ ok: true })
})

// Image upload
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, 'case_' + Date.now() + path.extname(file.originalname))
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

app.post('/api/admin/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  res.json({ ok: true, url: '/uploads/' + req.file.filename })
})

app.listen(process.env.PORT, () => console.log('OK'))
