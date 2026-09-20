// Service worker del panel de leads (/panel-leads). Solo hace dos cosas:
// mostrar la notificación cuando llega un push, y llevarte al panel si la
// tocás. No cachea nada del sitio — no tiene sentido meterse con el resto de
// las páginas públicas del sitio desde acá.
self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { title: 'PrepagaYa — Lead nuevo', body: event.data ? event.data.text() : '' }
  }

  const title = data.title || 'PrepagaYa — Lead nuevo'
  const options = {
    body: data.body || '',
    icon: '/panel-icon-192',
    badge: '/panel-icon-192',
    data: { url: data.url || '/panel-leads' },
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/panel-leads'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('/panel-leads') && 'focus' in client) return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(url)
    })
  )
})
