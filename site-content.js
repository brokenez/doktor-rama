(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory()
  else root.SiteContent = factory()
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  function get(object, key) { return key.split('.').reduce((value, part) => value?.[part], object) }
  function set(object, key, value) {
    const parts = key.split('.'); const last = parts.pop()
    let parent = object
    for (const part of parts) parent = parent[part] ||= {}
    parent[last] = value
  }
  function merge(base, value) {
    if (Array.isArray(value)) return value.map(item => item && typeof item === 'object' ? merge({}, item) : item)
    const output = { ...base }
    for (const [key, item] of Object.entries(value || {})) {
      if (['__proto__', 'prototype', 'constructor'].includes(key)) continue
      output[key] = item && typeof item === 'object' && !Array.isArray(item) ? merge(base?.[key], item) : Array.isArray(item) ? merge([], item) : item
    }
    return output
  }
  function safeUrl(value, image = false) {
    if (typeof value !== 'string' || !value) return ''
    if (image && /^(?:\/(?:uploads|assets)\/[^?#]+|\/?logo\.png)$/.test(value) && !value.split('/').includes('..')) return value
    try { const url = new URL(value); return url.protocol === 'https:' ? url.href : '' } catch { return '' }
  }
  function renderSite(document, data) {
    const make = (tag, className, text) => {
      const element = document.createElement(tag)
      if (className) element.className = className
      if (text !== undefined) element.textContent = String(text ?? '')
      return element
    }
    for (const element of document.querySelectorAll('[data-cms]')) {
      const key = element.getAttribute('data-cms')
      const value = get(data, key)
      if (value === undefined) continue
      if (key === 'hero.title') {
        const words = String(value).trim().split(/\s+/)
        const lines = String(value).includes('\n') ? String(value).split('\n') : [words[0] || '', words[1] || '', words.slice(2).join(' ')].filter(Boolean)
        element.replaceChildren()
        lines.forEach((line, index) => { if (index) element.append(make('br')); element.append(make('span', index === 1 ? 'accent' : '', line)) })
      } else if (element.hasAttribute('data-cms-heading')) {
        const words = String(value).trim().split(/\s+/)
        const accent = words.pop() || ''
        element.replaceChildren(document.createTextNode(words.length ? words.join(' ') + ' ' : ''), make('span', 'accent', accent))
      } else element.textContent = value
    }
    for (const attribute of ['placeholder','src','content','href']) {
      for (const element of document.querySelectorAll('[data-cms-' + attribute + ']')) {
        const value = get(data, element.getAttribute('data-cms-' + attribute))
        if (value === undefined) continue
        element.setAttribute(attribute, attribute === 'src' ? safeUrl(value, true) : attribute === 'href' ? safeUrl(value) : String(value))
        if (attribute === 'src') { element.hidden = !safeUrl(value, true); element.alt = data.brand.name }
      }
    }
    const contact = data.contacts
    for (const element of document.querySelectorAll('[data-contact]')) {
      const key = element.getAttribute('data-contact')
      if (key === 'phone') { element.textContent = contact.phone; element.setAttribute('href', 'tel:' + contact.phone.replace(/[^+\d]/g, '')) }
      else if (key === 'email') { element.textContent = contact.email; element.setAttribute('href', 'mailto:' + contact.email) }
      else if (key === 'address') element.textContent = [contact.city, contact.address].filter(Boolean).join(', ')
      else if (key === 'addressShort') element.textContent = contact.address
      else if (key === 'hours') element.textContent = contact.hours
      else { const url = safeUrl(contact[key]); element.hidden = !url; if (url) element.setAttribute('href', url); else element.removeAttribute('href') }
    }
    const replace = (id, items) => { const target = document.getElementById(id); if (target) target.replaceChildren(...items) }
    replace('services-grid', (data.services || []).map((service, index) => {
      const card = make('div', 'service-card reveal visible')
      card.append(make('div', 'service-num', String(index + 1).padStart(2, '0')), make('div', 'service-title', service.title), make('p', 'service-desc', service.desc), make('div', 'service-price', service.price))
      return card
    }))
    replace('cases-grid', (data.cases || []).map(item => {
      const card = make('div', 'case-card reveal visible' + (item.large ? ' large' : ''))
      const image = safeUrl(item.image, true)
      if (image) { const photo = make('img', 'case-photo'); photo.src = image; photo.alt = [item.tag, item.title].filter(Boolean).join(' — '); photo.loading = 'lazy'; card.append(photo) }
      else card.append(make('div', 'case-placeholder', 'Фото работы'))
      const overlay = make('div', 'case-card-overlay'); overlay.append(make('div', 'case-tag', item.tag), make('div', 'case-title', item.title)); card.append(overlay)
      return card
    }))
    replace('reviews-grid', (data.reviews || []).map(review => {
      const card = make('div', 'review-card reveal visible')
      const stars = make('div', 'review-stars'); const score = Math.max(1, Math.min(5, Number(review.stars) || 5))
      stars.setAttribute('aria-label', score + ' из 5')
      for (let i = 0; i < score; i++) stars.append(make('span', 'review-star', '★'))
      const author = make('div', 'review-author'); const avatar = make('div', 'review-avatar')
      const image = safeUrl(review.image, true)
      if (image) { const img = make('img'); img.src = image; img.alt = review.name || ''; img.loading = 'lazy'; avatar.append(img) } else avatar.textContent = (review.name || '').charAt(0)
      const info = make('div'); info.append(make('div', 'review-name', review.name), make('div', 'review-car', review.car)); author.append(avatar, info)
      card.append(stars, make('p', 'review-text', review.text), author); return card
    }))
    replace('about-stats', (data.aboutStats || []).map(item => { const node = make('div', 'why-stat'); node.append(make('div', 'why-stat-num', item.value), make('div', 'why-stat-label', item.label)); return node }))
    const icon = document.querySelector('.why-point-icon svg')?.cloneNode(true)
    replace('about-points', (data.aboutPoints || []).map((item, index) => {
      const node = make('div', 'why-point reveal visible'); const mark = make('div', 'why-point-icon')
      if (icon) mark.append(icon.cloneNode(true)); else mark.textContent = String(index + 1)
      const text = make('div'); text.append(make('div', 'why-point-title', item.title), make('div', 'why-point-text', item.text)); node.append(mark, text); return node
    }))
    replace('process-grid', (data.steps || []).map((item, index) => {
      const node = make('div', 'process-card reveal visible' + (index === data.steps.length - 1 && data.steps.length % 2 ? ' wide' : ''))
      const text = make('div'); text.append(make('div', 'process-card-title', item.title), make('div', 'process-card-desc', item.desc)); node.append(make('div', 'process-card-num', String(index + 1).padStart(2, '0')), text); return node
    }))
    replace('footer-services', (data.services || []).map(service => { const li = make('li'); const link = make('a', '', service.title); link.href = '#services'; li.append(link); return li }))
    const select = document.getElementById('service')
    if (select) {
      const selected = select.value
      const first = make('option', '', data.form.servicePlaceholder); first.value = ''
      const options = data.services.map(service => { const option = make('option', '', service.title); option.value = service.title; return option })
      const consultation = make('option', '', data.form.consultation); consultation.value = data.form.consultation
      select.replaceChildren(first, ...options, consultation)
      if ([...select.options].some(option => option.value === selected)) select.value = selected
    }
    for (const [selector, value] of [
      ['meta[property="og:title"],meta[name="twitter:title"]', data.seo.title],
      ['meta[property="og:description"],meta[name="twitter:description"]', data.seo.description],
      ['meta[property="og:site_name"]', data.brand.name], ['meta[property="og:url"]', data.seo.url]
    ]) for (const node of document.querySelectorAll(selector)) node.setAttribute('content', value)
    const logo = safeUrl(data.brand.logo, true)
    const logoUrl = logo ? new URL(logo, safeUrl(data.seo.url) || 'https://doctorrama.ru/').href : ''
    for (const node of document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]')) node.setAttribute('content', logoUrl)
    const schema = document.querySelector('script[type="application/ld+json"]')
    if (schema) {
      let business = {}; try { business = JSON.parse(schema.textContent) } catch {}
      Object.assign(business, { name: data.brand.name, description: data.seo.description, url: data.seo.url, telephone: contact.phone, email: contact.email, image: logoUrl,
        address: { '@type': 'PostalAddress', streetAddress: contact.address, addressLocality: contact.city, addressCountry: 'RU' }, sameAs: [safeUrl(contact.vk), safeUrl(contact.telegram)].filter(Boolean) })
      delete business.geo; delete business.openingHoursSpecification
      schema.textContent = JSON.stringify(business).replace(/</g, '\\u003c')
    }
  }
  return { get, set, merge, safeUrl, renderSite }
})
