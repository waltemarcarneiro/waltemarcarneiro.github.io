const CACHE_NAME = 'waltemar-v4.1.4';
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

// Ajustar lista de URLs para cachear - usando caminhos relativos
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icons/favicon.ico',
  './404.html',
  './offline.html',
  './css/preloader.css',
  './home.html',
  './css/home.css',
  './image/bg.webp',
  './image/bgabout.webp',
  './image/offline.svg',
  './bank/santander.html',
  './bank/script.js',
  './bank/bank.css',
  './bank/qrcodes/qrcode-santander.png',
  './bank/logos/icon192.png',
  './bank/logos/santander.svg',
  './components/modals/modalLogin.html',
  './components/modals/modalSantander.html',
  './css/modal-login.css',
  './css/modal.css',
  './css/profile.css'
];

// Função para verificar e solicitar permissão
async function requestNotificationPermission() {
  if (Notification.permission === 'granted') {
    return true;
  }
  
  // Como não podemos solicitar permissão diretamente do Service Worker,
  // vamos notificar o cliente para solicitar
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'REQUEST_NOTIFICATION_PERMISSION'
    });
  });
  return false;
}

// Função atualizada para mostrar notificação
async function showUpdateNotification() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.log('Permissão de notificação não concedida');
    return;
  }

  const options = {
    body: 'Clique em "Atualizar Agora" para usar a nova versão.',
    icon: './bank/logos/icon192.png', // Corrigido caminho do ícone
    badge: './bank/logos/icon192.png', // Corrigido caminho do badge
    tag: 'update-notification',
    renotify: true, // Força nova notificação mesmo com mesmo tag
    requireInteraction: true,
    actions: [
      {
        action: 'update-now',
        title: 'Atualizar Agora'
      },
      {
        action: 'update-later',
        title: 'Mais Tarde'
      }
    ]
  };

  await self.registration.showNotification('Nova versão disponível!', options);
}

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.group('⚙️ Service Worker Install');
  console.log('Nova versão:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url)
              .catch(error => {
                console.error(`Falha ao cachear: ${url}`, error);
                return Promise.resolve(); // Continua mesmo com erro
              });
          })
        );
      })
      .then(() => self.skipWaiting())
  );
  console.groupEnd();
});

// Ativação do Service Worker - Aqui é o melhor lugar para notificar
self.addEventListener('activate', event => {
  console.group('🚀 Service Worker Activate');
  console.log('Versão ativada:', CACHE_NAME);
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if (cache !== CACHE_NAME) {
              console.log('Service Worker: Removendo cache antigo:', cache);
              return caches.delete(cache);
            }
          })
        );
      }),
      self.clients.claim(),
      showUpdateNotification(), // Movido para aqui
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE'
          });
        });
      })
    ])
  );
  console.groupEnd();
});

// Receber mensagens do cliente
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting(); // Força a ativação do novo SW
  }
});

// Função para verificar o tamanho do cache
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

// Função para limpar cache antigo
async function cleanOldCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const now = Date.now();
  
  for (const request of keys) {
    const response = await cache.match(request);
    const cacheDate = new Date(response.headers.get('date')).getTime();
    
    if (now - cacheDate > MAX_CACHE_AGE) {
      await cache.delete(request);
      console.log('Removido do cache (antigo):', request.url);
    }
  }
}

// Função para limpar cache quando excede o tamanho máximo
async function trimCache(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const size = await checkCacheSize(cacheName);
  
  if (size > MAX_CACHE_SIZE) {
    console.log('Cache excedeu limite:', (size / 1024 / 1024).toFixed(2) + 'MB');
    // Remove os itens mais antigos primeiro
    const itemsToRemove = keys.slice(0, Math.floor(keys.length / 2));
    await Promise.all(itemsToRemove.map(key => cache.delete(key)));
  }
}

// Modificar o evento fetch para usar caminhos relativos
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(async cached => {
        if (cached) {
          // Verificar idade do cache
          const cacheDate = new Date(cached.headers.get('date')).getTime();
          if (Date.now() - cacheDate > MAX_CACHE_AGE) {
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
            
            // Verificar tamanho do cache antes de adicionar
            await trimCache(CACHE_NAME);
            await cache.put(event.request, responseToCache);
            
            return response;
          })
          .catch(() => {
            return caches.match('./offline.html');
          });
      })
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
  let data = {};
  try {
    // Tenta interpretar os dados como JSON
    data = event.data ? event.data.json() : {};
  } catch (error) {
    // Se não for JSON, usa os dados como texto bruto
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

// Remover o listener duplicado e manter apenas um mais completo
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'update-now') {
    // Força atualização e recarrega todas as abas
    self.skipWaiting()
      .then(() => self.clients.matchAll())
      .then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'RELOAD_PAGE' });
          client.navigate(client.url);
        });
      });
  }
});

// Adicionar verificação periódica de atualizações
setInterval(() => {
  self.registration.update();
}, 60 * 60 * 1000); // Verifica a cada 1 hora

// Adicionar limpeza periódica do cache
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(Promise.all([
      cleanOldCache(CACHE_NAME),
      trimCache(CACHE_NAME)
    ]));
  }
});