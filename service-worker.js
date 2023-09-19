// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "offline-page";

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "offline.html";
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/login.html',
  '/app.html',
  '/offline.html',
  '/bank/itau.html',
  '/bank/bradesco.html',
  '/player/index.html',
];


// Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener("install", function (event) {
  console.log("Install Event processing");

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("Cached offline page during install");
      return cache.addAll(urlsToCache);
    })
  );
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        console.log("add page to offline cache: " + response.url);

        // If request was success, add or update it in the cache
        event.waitUntil(updateCache(event.request, response.clone()));

        return response;
      })
      .catch(function (error) {
        console.log("Network request Failed. Serving content from cache: " + error);
        return fromCache(event.request);
      })
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return the offline page
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        // The following validates that the request was for a navigation to a new document
        if (request.destination !== "document" || request.mode !== "navigate") {
          return Promise.reject("no-match");
        }

        return cache.match(urlsToCache);
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}

// abaixo PERIODIC SYNC

// Evento de sincronização periódica
self.addEventListener('periodicsync', (event) => {
  // Verifica se o evento de sincronização é para a tag 'my-sync'
  if (event.registration.tag === 'my-sync') {
    event.waitUntil(doSync()); // Chama a função para sincronização
  }
});

// Função para realizar a sincronização
function doSync() {
  // Implemente a lógica de atualização aqui, por exemplo, buscar novos dados ou atualizar o cache.
  // Certifique-se de atualizar a lógica de acordo com suas necessidades.
  // Você pode usar a função fetch para buscar dados do servidor.
  // Por exemplo:
  return fetch('/api/update-data')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do servidor');
      }
      return response.json();
    })
    .then((data) => {
      // Atualize o cache ou realize outras operações necessárias com os dados.
      console.log('Dados atualizados com sucesso', data);
    })
    .catch((error) => {
      console.error('Erro na sincronização periódica', error);
    });
}

// Registro da sincronização periódica
if ('periodicSync' in self.registration) {
  self.registration.periodicSync.register('my-sync', {
    minInterval: 6 * 60 * 60 * 1000, // Intervalo de sincronização em milissegundos (6 horas)
  });
}
