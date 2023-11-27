const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
  '/',
  '/login.html',
  '/app.html',
  '/offline.html',
  '/bank/picpay.html',
  '/profile.html',
  '/player/index.html',
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
