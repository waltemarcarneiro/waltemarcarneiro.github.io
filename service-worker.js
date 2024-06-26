const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
  '/',
  '/home.html',
  '/home.css',
  '/offline.html',
  '/image/offline.svg',
  '/bank/sofisa.html',
  '/bank/script.js',
  '/bank/styles.css',
  '/bank/image/wallpaper.jpg',
  '/bank/qrcodes/qrcode-sofisa.png',
  '/bank/logos/icon192.png',
  '/bank/logos/sofisa.svg',
  '/videos/index.html',
  '/videos/playlist.html',
  '/videos/banner.css',
  '/videos/banner.js',
  '/videos/bg.jpg',
  '/videos/anime.png',
];

self.addEventListener('install', function(event) {
  console.log('Install Event processing');

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Cached offline page during install');
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log('Serving from cache: ', event.request.url);
        return response;
      }

      console.log('Fetching from network: ', event.request.url);
      return fetch(event.request)
        .then(function(networkResponse) {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clonedResponse);
          });

          return networkResponse;
        })
        .catch(function() {
          console.log('Fetch failed; returning offline page instead.');
          return caches.match('/offline.html');
        });
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('Activating new service worker...');

  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Sincronização em segundo plano
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

function syncUserData() {
  // Implementar a lógica para sincronizar os dados do usuário
  return fetch('/sync-data')
    .then(response => response.json())
    .then(data => {
      console.log('Dados do usuário sincronizados:', data);
    })
    .catch(error => {
      console.error('Erro ao sincronizar os dados do usuário:', error);
    });
}

// Sincronização periódica
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(checkForUpdates());
  }
});

function checkForUpdates() {
  // Implementar a lógica para verificar atualizações
  return fetch('/check-updates')
    .then(response => response.json())
    .then(data => {
      console.log('Atualizações verificadas:', data);
    })
    .catch(error => {
      console.error('Erro ao verificar atualizações:', error);
    });
}

// Notificações push
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'Você tem uma nova notificação!',
    icon: data.icon || '/bank/logos/icon192.png',
    badge: data.badge || '/bank/logos/icon192.png'
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Nova notificação', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});
