const CACHE_NAME = 'waltemar-v4.0.7';
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
    body: 'Uma nova versão do aplicativo está disponível com melhorias de desempenho e novos recursos.',
    icon: '/bank/logos/icon192.png',
    badge: '/bank/logos/icon192.png',
    tag: 'update-notification',
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

  return self.registration.showNotification('Nova Atualização Disponível', options);
}

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.group('⚙️ Service Worker Install');
  console.log('Nova versão:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).then(() => {
      return showUpdateNotification();
    })
  );
  console.groupEnd();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.group('🚀 Service Worker Activate');
  console.log('Versão ativada:', CACHE_NAME);
  console.log('Service Worker: Ativando nova versão');
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
      self.clients.matchAll().then(clients => {
        console.log('Service Worker: Notificando clientes:', clients.length);
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

// Modificar o evento fetch para implementar a estratégia "Somente cache"
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        // Retorna do cache se existir
        if (cached) {
          console.log('Serving from cache:', event.request.url);
          return cached;
        }

        // Se não estiver no cache, tenta buscar da rede e guarda no cache
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
                console.log('Added to cache:', event.request.url);
              });

            return response;
          })
          .catch(() => {
            console.log('Fetch failed, returning offline page');
            return caches.match('/offline.html');
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

// Manipular cliques na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'update-now') {
    // Forçar atualização
    self.skipWaiting().then(() => {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.navigate(client.url));
      });
    });
  }
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
