(() => {
  let data = SiteContent.merge({}, SiteSchema.defaults)
  const burger = document.getElementById('burger')
  const mobileNav = document.getElementById('mobileNav')
  let navOpen = false
  window.closeMobileNav = () => { navOpen = false; mobileNav.classList.remove('open'); document.body.style.overflow = ''; burger.setAttribute('aria-expanded', 'false') }
  burger.addEventListener('click', () => { navOpen = !navOpen; mobileNav.classList.toggle('open', navOpen); document.body.style.overflow = navOpen ? 'hidden' : ''; burger.setAttribute('aria-expanded', String(navOpen)) })
  burger.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); burger.click() } })
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) } }), { threshold: 0.1 })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
  } else document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'))
  const navbar = document.getElementById('navbar')
  window.addEventListener('scroll', () => { navbar.style.background = window.scrollY > 60 ? 'rgba(9,26,46,0.98)' : 'rgba(9,26,46,0.92)' }, { passive: true })
  SiteContent.renderSite(document, data)
  fetch('/api/data', { cache: 'no-store' }).then(response => {
    if (!response.ok) throw new Error('Content unavailable')
    return response.json()
  }).then(content => { data = SiteContent.merge(data, content); SiteContent.renderSite(document, data) }).catch(error => console.error('Не удалось обновить контент:', error.message))
  const form = document.querySelector('.contact-form')
  form.removeAttribute('onsubmit')
  form.addEventListener('submit', async event => {
    event.preventDefault()
    const button = form.querySelector('[type="submit"]')
    if (button.disabled) return
    const body = Object.fromEntries(['name','phone','car','service','message'].map(key => [key, document.getElementById(key).value.trim()]))
    button.disabled = true; button.textContent = data.form.sending
    const status = document.getElementById('form-status') || (() => { const node = document.createElement('p'); node.id = 'form-status'; node.setAttribute('role', 'status'); form.append(node); return node })()
    status.textContent = ''
    try {
      const response = await fetch('/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error('Send failed')
      status.textContent = data.form.success; form.reset()
    } catch { status.textContent = data.form.error }
    finally { button.disabled = false; button.textContent = data.form.submit }
  })
})()
