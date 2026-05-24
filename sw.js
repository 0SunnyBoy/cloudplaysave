// CloudPlayGames Service Worker v1.0
const CACHE_NAME = 'CloudPlayGames-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - Cache First with Network Fallback
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // Offline fallback for navigation
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'CloudPlayGames', {
      body: data.body || 'Nova oferta disponível!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'CloudPlayGames-notification'
    })
  );
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
