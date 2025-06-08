if ('serviceWorker' in navigator) {
    let refreshing = false;

    // Registrar service worker com escopo específico
    navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
    })
        .then(registration => {
            console.log('ServiceWorker registrado com sucesso. Escopo:', registration.scope);
            
            // Verificar atualizações imediatamente
            registration.update();

            registration.addEventListener('updatefound', () => {
                console.log('Nova versão do Service Worker encontrada');
                const newWorker = registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    console.log('Service Worker estado:', newWorker.state);
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        console.log('Nova versão instalada');
                        showUpdateToast();
                    }
                });
            });
        })
        .catch(error => {
            console.error('Erro ao registrar ServiceWorker:', error);
        });

    // Ouvir mensagens do Service Worker
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('Mensagem recebida do SW:', event.data);
        if (event.data.type === 'UPDATE_AVAILABLE') {
            showUpdateToast();
        }
    });

    // Atualizar página quando o novo service worker assumir
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
}
