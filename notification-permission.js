if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', async event => {
    if (event.data.type === 'REQUEST_NOTIFICATION_PERMISSION') {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Recarrega o service worker para mostrar a notificação
          const registration = await navigator.serviceWorker.ready;
          registration.update();
        }
      } catch (error) {
        console.error('Erro ao solicitar permissão:', error);
      }
    }
  });
}
