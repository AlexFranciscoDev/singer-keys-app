const CACHE = 'skm-v1'

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['/', '/index.html'])
    )
  )
})

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('firestore.googleapis.com')) return
  e.respondWith(
    caches.match(e.request).then((cached) => cached ?? fetch(e.request))
  )
})
