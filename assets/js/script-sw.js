if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/assets/js/service-worker.js')
    .then(serviceWorker => {
      console.log('Service Worker registered: ' + serviceWorker);
    })
    .catch(error => {
      console.log('Error registering the Service Worker: ' + error);
    });
}
