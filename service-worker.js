const CACHE_NAME = 'my-site-cache-v2';
const urlsToCache = [
  '/',
  '/login.html',
  '/app.html',
  '/offline.html',
  '/bank/itau.html',
  '/bank/bradesco.html',
];

self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Cached offline page during install");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("add page to offline cache: " + response.url);

        // If request was successful, add or update it in the cache
        return caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(function (error) {
        console.log("Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        if (request.destination !== "document" || request.mode !== "navigate") {
          return caches.match('/offline.html');
        }

        return caches.match('/offline.html');
      }

      return matching;
    });
  });
}

// Outros eventos de sincronização e registros de fundo podem ser mantidos, desde que sejam relevantes para o seu aplicativo.


function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}

// SYNC

// Defina as páginas HTML que deseja sincronizar e atualizar
const pagesToSync = [
  '/',
  '/app.html',
];

// Função para sincronizar e atualizar as páginas HTML
function syncAndUpdatePages() {
  return Promise.all(
    pagesToSync.map((page) => {
      // Realize a sincronização da página com o servidor
      return fetch(page)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Erro ao buscar ${page} do servidor`);
          }
          return response.text();
        })
        .then((html) => {
          // Atualize o cache com a versão mais recente da página HTML
          return caches.open(CACHE_NAME).then((cache) => {
            return cache.put(page, new Response(html));
          });
        });
    })
  );
}

// Registro da sincronização periódica
self.addEventListener('periodicsync', (event) => {
  // Verifique se o evento de sincronização é para a tag 'periodic-sync'
  if (event.registration.tag === 'periodic-sync') {
    event.waitUntil(syncAndUpdatePages()); // Chama a função para sincronização
  }
});

// Registro do evento de Background Sync
self.addEventListener('sync', (event) => {
  // Verifique se o evento de sincronização é para a tag 'background-sync'
  if (event.tag === 'background-sync') {
    event.waitUntil(syncAndUpdatePages()); // Chame a função para sincronização
  }
});

// Registro da sincronização periódica
if ('periodicSync' in self.registration) {
  self.registration.periodicSync.register('periodic-sync', {
    minInterval: 6 * 60 * 60 * 1000, // Intervalo de sincronização periódica em milissegundos (6 horas)
  });
}

// Registro do evento de Background Sync
self.addEventListener('install', (event) => {
  event.waitUntil(
    self.registration.sync.register('background-sync')
  );
});
