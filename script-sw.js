if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            if (confirm('Nova versão disponível. Atualizar agora?')) {
              newWorker.postMessage({ action: 'skipWaiting' });
            }
          }
        });
      });

      if ('PeriodicSyncManager' in registration) {
        registration.periodicSync.register('periodic-sync', {
          minInterval: 24 * 60 * 60 * 1000, // 1 dia
        }).catch(error => {
          console.error('Periodic Sync could not be registered!', error);
        });
      }
    }).catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}
