if ('serviceWorker' in navigator) {
    let refreshing = false;

    // Registrar service worker
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('ServiceWorker registrado');

            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('Nova versão disponível');
                        window.UpdateManager.showUpdateNotification();
                    }
                });
            });
        });

    // Atualizar página quando o novo service worker assumir
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}

// Função para mostrar o toast de atualização
function showUpdateToast() {
  fetch('/update-toast.html')
    .then(response => response.text())
    .then(html => {
      // Remover toast anterior se existir
      const oldToast = document.getElementById('update-notification');
      if (oldToast) oldToast.remove();

      // Adicionar novo toast
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div.querySelector('#update-notification'));

      // Mostrar notificação
      const notification = document.getElementById('update-notification');
      notification.classList.remove('hidden');

      // Configurar botões
      document.getElementById('update-now').addEventListener('click', () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ action: 'skipWaiting' });
        }
      });

      document.getElementById('update-later').addEventListener('click', () => {
        notification.classList.add('hidden');
      });
    })
    .catch(error => console.error('Erro ao carregar toast:', error));
}
