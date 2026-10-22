(() => {
  const { get, set, merge, safeUrl } = SiteContent
  const $ = id => document.getElementById(id)
  const dirty = new Set()
  let siteData = {}, token = '', page = 'hero', pendingUploads = 0, saving = false
  const storage = {
    get(key) { try { return sessionStorage.getItem(key) } catch { return null } },
    set(key, value) { try { sessionStorage.setItem(key, value) } catch {} },
    remove(key) { try { sessionStorage.removeItem(key) } catch {} }
  }
  function make(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node }
  async function api(url, body) {
    let response
    try { response = await fetch(url, { method: body === undefined ? 'GET' : 'POST', cache: 'no-store', headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), 'x-admin-token': token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }) }
    catch { throw new Error('Нет соединения с сервером. Проверьте интернет и повторите попытку.') }
    let result
    try { result = await response.json() } catch { throw new Error('Сервер не вернул данные админки. Проверьте запуск приложения на хостинге.') }
    if (response.status === 401) throw new Error('Неверный пароль или вход устарел. Войдите заново.')
    if (!response.ok || result.ok === false) throw new Error(result.error || 'Не удалось сохранить изменения. Повторите попытку.')
    return result
  }
  function updateStatus() {
    $('dirty-status').textContent = dirty.has(page) ? 'Есть несохранённые изменения в этом разделе' : 'Изменений в этом разделе нет'
    $('save-button').disabled = pendingUploads > 0 || saving
    $('save-button').textContent = pendingUploads ? 'Загружаем фотографию…' : saving ? 'Сохраняем…' : 'Сохранить изменения'
  }
  function markDirty() { dirty.add(page); $('save-status').textContent = ''; $('save-error').textContent = ''; updateStatus() }
  function field(definition, value, change, id) {
    const label = make('label', 'field'); label.htmlFor = id
    const caption = make('span', 'field-label', definition.label); label.append(caption)
    if (definition.type === 'image') {
      const wrapper = make('div', 'field'); const imageLabel = make('label', 'field-label', definition.label); imageLabel.htmlFor = id; wrapper.append(imageLabel)
      const preview = make('img', 'image-preview'); preview.alt = definition.label; const url = safeUrl(value, true); preview.hidden = !url; if (url) preview.src = url
      const actions = make('div', 'image-actions')
      const input = make('input'); input.type = 'file'; input.id = id; input.accept = 'image/jpeg,image/png,image/webp,image/gif'
      const remove = make('button', 'button danger', 'Удалить фотографию'); remove.type = 'button'; remove.hidden = !url
      const error = make('p', 'error'); error.setAttribute('role', 'alert')
      remove.addEventListener('click', () => { change(''); preview.removeAttribute('src'); preview.hidden = true; remove.hidden = true; markDirty() })
      input.addEventListener('change', async () => {
        const file = input.files[0]; if (!file) return
        error.textContent = ''
        if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || file.size > 10 * 1024 * 1024) { error.textContent = 'Выберите JPG, PNG, WebP или GIF размером до 10 МБ.'; input.value = ''; return }
        pendingUploads++; updateStatus(); input.disabled = true
        try {
          const body = new FormData(); body.append('image', file)
          const response = await fetch('/api/admin/upload', { method: 'POST', headers: { 'x-admin-token': token }, body })
          const result = await response.json()
          if (!response.ok || !result.ok) throw new Error(response.status === 401 ? 'Войдите заново для загрузки фотографии.' : result.error || 'Не удалось загрузить фотографию.')
          change(result.url); preview.src = result.url; preview.hidden = false; remove.hidden = false; markDirty()
        } catch (failure) { error.textContent = failure.message || 'Не удалось загрузить фотографию.' }
        finally { pendingUploads--; input.disabled = false; input.value = ''; updateStatus() }
      })
      actions.append(input, make('span', 'hint', 'JPG, PNG, WebP или GIF, до 10 МБ. После загрузки сохраните раздел.'), remove)
      wrapper.append(preview, actions, error); return wrapper
    }
    let input
    if (definition.type === 'rating') {
      input = make('select'); for (let rating = 1; rating <= 5; rating++) { const option = make('option', '', String(rating)); option.value = String(rating); input.append(option) }
    } else input = make(definition.type === 'textarea' ? 'textarea' : 'input')
    input.id = id
    if (definition.type === 'checkbox') { input.type = 'checkbox'; input.checked = Boolean(value); label.prepend(input) }
    else { if (input.tagName === 'INPUT') input.type = ['email','url'].includes(definition.type) ? definition.type : 'text'; input.value = value ?? (definition.type === 'rating' ? 5 : ''); label.append(input) }
    input.addEventListener(definition.type === 'checkbox' || definition.type === 'rating' ? 'change' : 'input', () => { change(definition.type === 'checkbox' ? input.checked : definition.type === 'rating' ? Number(input.value) : input.value); markDirty() })
    if (definition.hint) label.append(make('span', 'hint', definition.hint))
    return label
  }
  function renderList(definition) {
    const card = make('section', 'card'); card.append(make('h2', '', definition.title))
    const items = siteData[definition.key] ||= []
    if (!items.length) card.append(make('p', 'muted', 'Пока нет записей. Добавьте первую.'))
    items.forEach((item, index) => {
      const container = make('div', 'item'); const header = make('div', 'item-header'); const actions = make('div', 'item-actions')
      for (const [offset, title, text] of [[-1,'Переместить выше','↑'],[1,'Переместить ниже','↓'],[0,'Удалить запись','Удалить']]) {
        const button = make('button', 'button' + (!offset ? ' danger' : ''), text); button.type = 'button'; button.setAttribute('aria-label', title + ': ' + definition.singular + ' ' + (index + 1)); button.disabled = offset ? index + offset < 0 || index + offset >= items.length : false
        button.addEventListener('click', () => {
          if (pendingUploads || saving) return
          if (!offset) { if (!confirm('Удалить запись? Изменение вступит в силу после сохранения раздела.')) return; items.splice(index, 1) }
          else [items[index], items[index + offset]] = [items[index + offset], items[index]]
          markDirty(); renderPage()
        }); actions.append(button)
      }
      header.append(make('h3', '', definition.singular + ' ' + (index + 1)), actions); container.append(header)
      for (const property of definition.fields) container.append(field(property, item[property.key], value => { item[property.key] = value }, `${definition.key}-${index}-${property.key}`))
      card.append(container)
    })
    const add = make('button', 'button', '+ Добавить: ' + definition.singular.toLowerCase()); add.type = 'button'
    add.addEventListener('click', () => {
      if (pendingUploads || saving) return
      const item = { id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : Date.now() }
      for (const property of definition.fields) item[property.key] = property.type === 'checkbox' ? false : property.type === 'rating' ? 5 : ''
      items.push(item); markDirty(); renderPage()
      document.getElementById(`${definition.key}-${items.length - 1}-${definition.fields[0].key}`)?.focus()
    }); card.append(add); return card
  }
  function renderPage() {
    $('page-title').textContent = SiteSchema.pages.find(item => item.id === page).title
    $('section-select').value = page
    for (const button of $('section-navigation').children) { if (button.dataset.page === page) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current') }
    const content = $('editor-fields'); content.replaceChildren()
    const definitions = SiteSchema.fields.filter(item => item.page === page)
    if (definitions.length) {
      const card = make('section', 'card'); card.append(make('h2', '', 'Тексты и настройки'))
      for (const definition of definitions) card.append(field(definition, get(siteData, definition.key), value => set(siteData, definition.key, value), definition.key.replaceAll('.', '-')))
      content.append(card)
    }
    for (const definition of SiteSchema.lists.filter(item => item.page === page)) content.append(renderList(definition))
    updateStatus()
  }
  function choosePage(id) {
    if (!SiteSchema.pages.some(item => item.id === id)) return
    if (pendingUploads || saving) { $('save-error').textContent = 'Дождитесь завершения загрузки или сохранения.'; $('section-select').value = page; return }
    page = id; storage.set('admin_page', id); $('save-status').textContent = ''; $('save-error').textContent = ''; renderPage()
  }
  function pagePatch() {
    const patch = {}
    for (const definition of SiteSchema.fields.filter(item => item.page === page)) set(patch, definition.key, get(siteData, definition.key))
    for (const definition of SiteSchema.lists.filter(item => item.page === page)) patch[definition.key] = siteData[definition.key]
    return JSON.parse(JSON.stringify(patch))
  }
  $('editor').addEventListener('submit', async event => {
    event.preventDefault(); if (pendingUploads || saving) return
    const patch = pagePatch(); saving = true; updateStatus(); $('save-error').textContent = ''; $('save-status').textContent = ''
    try {
      await api('/api/admin/content', patch)
      if (JSON.stringify(pagePatch()) === JSON.stringify(patch)) dirty.delete(page)
      $('save-status').textContent = 'Изменения сохранены. На сайте они появятся после обновления страницы.'
    } catch (error) { $('save-error').textContent = error.message }
    finally { saving = false; updateStatus() }
  })
  async function openAdmin() {
    await api('/api/admin/session')
    siteData = merge(SiteSchema.defaults, await api('/api/data'))
    page = storage.get('admin_page') || 'hero'; if (!SiteSchema.pages.some(item => item.id === page)) page = 'hero'
    $('login-screen').hidden = true; $('admin-screen').hidden = false; renderPage()
  }
  $('login-form').addEventListener('submit', async event => {
    event.preventDefault(); const button = $('login-button'); if (button.disabled) return
    button.disabled = true; button.textContent = 'Входим…'; $('login-error').textContent = ''
    try {
      const result = await api('/api/admin/login', { password: $('password-input').value })
      token = result.token; storage.set('admin_token', token); await openAdmin(); $('password-input').value = ''
      try { localStorage.removeItem('admin_token') } catch {}
    } catch (error) { $('login-error').textContent = error.message }
    finally { button.disabled = false; button.textContent = 'Войти' }
  })
  $('logout-button').addEventListener('click', () => {
    if (pendingUploads || saving) { $('save-error').textContent = 'Дождитесь завершения загрузки или сохранения.'; return }
    if (dirty.size && !confirm('Есть несохранённые изменения. Выйти без сохранения?')) return
    token = ''; dirty.clear(); storage.remove('admin_token'); try { localStorage.removeItem('admin_token') } catch {}
    $('admin-screen').hidden = true; $('login-screen').hidden = false; $('login-error').textContent = ''
  })
  for (const item of SiteSchema.pages) {
    const button = make('button', 'nav-button', item.title); button.type = 'button'; button.dataset.page = item.id; button.addEventListener('click', () => choosePage(item.id)); $('section-navigation').append(button)
    const option = make('option', '', item.title); option.value = item.id; $('section-select').append(option)
  }
  $('section-select').addEventListener('change', event => choosePage(event.target.value))
  window.addEventListener('beforeunload', event => { if (dirty.size || pendingUploads) { event.preventDefault(); event.returnValue = '' } })
  token = storage.get('admin_token') || ''
  if (!token) try { token = localStorage.getItem('admin_token') || '' } catch {}
  if (token) openAdmin().then(() => { storage.set('admin_token', token); try { localStorage.removeItem('admin_token') } catch {} }).catch(error => { token = ''; storage.remove('admin_token'); $('login-error').textContent = error.message })
})()
