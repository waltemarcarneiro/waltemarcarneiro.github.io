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

// Registro da sincronização periódica após a ativação
self.addEventListener('activate', function(event) {
  // Faça a ativação e, em seguida, registre a sincronização periódica e o evento de Background Sync
  event.waitUntil(
    // Outras operações de ativação, se necessário

    // Registro da sincronização periódica
    if ('periodicSync' in self.registration) {
      self.registration.periodicSync.register('periodic-sync', {
        minInterval: 6 * 60 * 60 * 1000, // Intervalo de sincronização periódica em milissegundos (6 horas)
      });
    }

    // Registro do evento de Background Sync
    self.registration.sync.register('background-sync')
  );
});

// Restante do seu código do Service Worker
