// ...existing service worker code...

// Exemplo problemático (a remover/comentar):
// self.addEventListener('install', event => {
//   self.skipWaiting(); // força ativação imediata
// });

// self.addEventListener('activate', event => {
//   event.waitUntil(self.clients.claim()); // assume controle imediatamente
// });

// Proposta: comentar skipWaiting/clients.claim e suportar mensagem de SKIP_WAITING
// (assim a página decide quando aplicar a nova versão)

self.addEventListener('install', event => {
  // não chamamos skipWaiting() automaticamente
  // self.skipWaiting(); // removido para evitar takeover imediato
});

self.addEventListener('activate', event => {
  // não chamamos clients.claim() automaticamente
  // event.waitUntil(self.clients.claim()); // removido
});

// Ou, manter lógica mas controlar via mensagem:
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
