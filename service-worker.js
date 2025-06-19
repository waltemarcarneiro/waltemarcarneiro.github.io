const CACHE_NAME = 'waltemar-v4.1.10';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; 
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; 

const urlsToCache = [
  '/index.html',
  '/manifest.json',
  '/icons/favicon.ico',
  '/404.html',
  '/offline.html',
  '/css/index.css',
  '/image/background2.webp',
  '/bank/santander.html',
  '/bank/bb.html',
  '/bank/script.js',
  '/bank/bank.css',
  '/bank/qrcodes/qrcode-santander.png',
  '/bank/qrcodes/qrcode-bb.png',
  '/bank/logos/icon192.png',
  '/bank/logos/santander.svg',
  '/bank/logos/bb.svg',
  '/components/modals/modalLogin.html',
  '/components/modals/modalSantander.html',
  '/css/modal-login.css',
  '/css/modal.css',
  '/css/profile.css'
];

async function requestNotificationPermission() {
  if (Notification.permission === 'granted') return true;
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'REQUEST_NOTIFICATION_PERMISSION' }));
  return false;
}

async function showUpdateNotification() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const options = {
    body: 'Clique em "Atualizar Agora" para usar a nova versão.',
    icon: './bank/logos/icon192-vn.png',
    badge: './bank/logos/icon192.nv.png',
    tag: 'update-notification',
    renotify: true,
    requireInteraction: true,
    actions: [
      { action: 'update-now', title: 'Atualizar Agora' },
      { action: 'update-later', title: 'Mais Tarde' }
    ]
  };

  await self.registration.showNotification('Nova versão disponível!', options);
}

self.addEventListener('install', event => {
  console.group('Service Worker Install');
  console.log('Nova versão:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(urlsToCache.map(url =>
        cache.add(url).catch(err => {
          console.error(`Falha ao cachear: ${url}`, err);
          return Promise.resolve();
        })
      )).then(() => self.skipWaiting())
    )
  );
  console.groupEnd();
});

self.addEventListener('activate', event => {
  console.group('Service Worker Activate');
  console.log('Versão ativada:', CACHE_NAME);
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(cache =>
        cache !== CACHE_NAME ? caches.delete(cache) : null
      ));
      await self.clients.claim();

      // Só dispara notificação se o cache novo for diferente do anterior
      const previousCache = await caches.open('__version');
      const versionData = await previousCache.match('version');
      const oldVersion = versionData ? await versionData.text() : null;

      if (oldVersion !== CACHE_NAME) {
        await previousCache.put('version', new Response(CACHE_NAME));
        await showUpdateNotification(); // só dispara se for uma nova versão mesmo
        const clients = await self.clients.matchAll();
        clients.forEach(client => client.postMessage({ type: 'UPDATE_AVAILABLE' }));
      }
    })()
  );
  console.groupEnd();
});

self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

async function checkCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let size = 0;
  for (const request of keys) {
    const response = await cache.match(request);
    const blob = await response.blob();
    size += blob.size;
  }
  return size;
}

async function cleanOldCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const now = Date.now();

  for (const request of keys) {
    const response = await cache.match(request);
    const dateHeader = response.headers.get('date');
    if (!dateHeader) continue;
    const cacheDate = new Date(dateHeader).getTime();
    if (now - cacheDate > MAX_CACHE_AGE) {
      await cache.delete(request);
      console.log('Removido do cache (antigo):', request.url);
    }
  }
}

async function trimCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const size = await checkCacheSize(cacheName);

  if (size > MAX_CACHE_SIZE) {
    console.log('Cache excedeu limite:', (size / 1024 / 1024).toFixed(2) + 'MB');
    const itemsToRemove = keys.slice(0, Math.floor(keys.length / 2));
    await Promise.all(itemsToRemove.map(key => cache.delete(key)));
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(async cached => {
      if (cached) {
        const dateHeader = cached.headers.get('date');
        const cacheDate = dateHeader ? new Date(dateHeader).getTime() : null;
        if (cacheDate && Date.now() - cacheDate > MAX_CACHE_AGE) {
          console.log('Cache expirado:', event.request.url);
          return fetch(event.request);
        }
        return cached;
      }

      return fetch(event.request)
        .then(async response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          const cache = await caches.open(CACHE_NAME);
          await trimCache(CACHE_NAME);
          await cache.put(event.request, responseToCache);
          return response;
        })
        .catch(() => caches.match('./offline.html'));
    })
  );
});

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

self.addEventListener('periodicsync', event => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(checkForUpdates());
  }
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(Promise.all([
      cleanOldCache(CACHE_NAME),
      trimCache(CACHE_NAME)
    ]));
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

self.addEventListener('push', event => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('Erro ao interpretar dados da mensagem push:', error);
    data = { body: event.data ? event.data.text() : 'Nova notificação recebida!' };
  }

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

  if (event.action === 'update-now') {
    self.skipWaiting().then(() => self.clients.matchAll()).then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'RELOAD_PAGE' });
        client.navigate(client.url);
      });
    });
  }
});
