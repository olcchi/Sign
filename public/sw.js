self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/Sign-Logo.png',
      badge: '/Sign-Logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    }
    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')
  event.notification.close()
  event.waitUntil(clients.openWindow(self.location.origin))
})

// Install event - cache important resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('sign-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/Sign-Logo.png',
        '/sign-light.svg',
        '/sign-dark.svg'
      ])
    })
  )
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    })
  )
}) 