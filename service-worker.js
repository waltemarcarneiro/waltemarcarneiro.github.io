const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
  '/',
  '/home.html',
  '/home.css',
  '/offline.html',
  '/bank/sofisa.html',
  '/bank/script.js',
  '/bank/styles.css',
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
