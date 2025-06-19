async function showNotificationModal() {
    const modal = document.getElementById('notificationModal');
    modal.style.display = 'block';

    return new Promise((resolve) => {
        document.getElementById('allowNotifications').onclick = async () => {
            modal.style.display = 'none';
            const permission = await Notification.requestPermission();
            resolve(permission);
        };

        document.getElementById('denyNotifications').onclick = () => {
            modal.style.display = 'none';
            resolve('denied');
        };
    });
}

async function initializeNotifications() {
    // Aguarda 2 minutos antes de verificar
    await new Promise(resolve => setTimeout(resolve, 120000));

    // Verifica se já tem permissão
    if (Notification.permission === 'granted') {
        console.log('Notificações já estão permitidas');
    } else if (Notification.permission === 'default') {
        // Só mostra o modal se a permissão ainda não foi decidida
        const permission = await showNotificationModal();
        if (permission === 'granted') {
            console.log('Permissão de notificação concedida');
        }
    }
}

document.addEventListener('DOMContentLoaded', initializeNotifications);
