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
  '/bank/qrcodes/qrcode-sofisa.png',
  '/bank/logos/icon192.png',
  '/bank/logos/sofisa.svg',
  '/videos/index.html',
  '/videos/index.jpg',
  '/videos/playlist.html',
  '/videos/banner.css',
  '/videos/banner.js',
  '/videos/bg.jpg',
  '/videos/anime.png',
];

// Instalação do service worker e cache dos recursos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return Promise.all(urlsToCache.map(url =>
                cache.add(url).catch(err => {
                    console.error(`Erro ao adicionar ${url} ao cache:`, err);
                })
            ));
        }).then(() => self.skipWaiting())
    );
});

// Fetch event para servir recursos do cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('Serving from cache: ', event.request.url);
        return response;
      }

      console.log('Fetching from network: ', event.request.url);
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const clonedResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clonedResponse);
        });

        return networkResponse;
      }).catch(() => {
        console.log('Fetch failed; returning offline page instead.');
        return caches.match('/offline.html');
      });
    })
  );
});

// Ativação do service worker e limpeza de caches antigos
self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Sincronização em segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

function syncUserData() {
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
self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(checkForUpdates());
  }
});

function checkForUpdates() {
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
self.addEventListener('push', event => {
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

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});

// Atualizações do Service Worker
let newWorker;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).then(() => {
      self.skipWaiting();
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
