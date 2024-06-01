const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
  '/',
  '/login.html',
  '/app.html',
  '/offline.html',
  '/bank/bb.html',
  '/bank/sofisa.html',
  '/profile.html',
  '/downloads/apps.html',
  '/videos/index.html',
  '/videos/video.mp4',
];

self.addEventListener('install', function(event) {
  console.log('Install Event processing');

  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Cached offline page during install');
      return cache.addAll(urlsToCache);
    })
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
    })
  );
});
