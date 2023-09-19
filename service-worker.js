// Defina as páginas HTML que deseja sincronizar e atualizar
const pagesToSync = [
  '/',
  '/login.html',
  '/app.html',
  '/offline.html',
  '/bank/itau.html',
  '/bank/bradesco.html',
  '/player/index.html',
  // Adicione outras páginas aqui
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
