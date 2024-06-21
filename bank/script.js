function copyText(type) {
    let textElement = document.querySelector(`.action[onclick="copyText('${type}')"] .copy-text`);
    let text = textElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        showNotification(type);
        toggleOverlay(true); // Adicione aqui para aplicar a sobreposição
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
    });
}

function showNotification(type) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notification-message');
    if (type === 'qr') {
        const qrMessage = document.getElementById('qr-message').innerHTML; // Use innerHTML
        messageElement.innerHTML = qrMessage; // Use innerHTML
    } else if (type === 'key') {
        const keyMessage = document.getElementById('key-message').innerHTML; // Use innerHTML
        messageElement.innerHTML = keyMessage; // Use innerHTML
    }
    notification.classList.add('show');
}

function closeNotification(event) {
    if (event) event.stopPropagation();
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
    toggleOverlay(false); // Adicione aqui para remover a sobreposição
}

// Adicione o evento de clique ao ícone de seta à esquerda
        document.getElementById('backButton').addEventListener('click', () => {
            // Volta para a página anterior
            history.back();
        });
//evento de compartilhamento        
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Link de pagamentos e Transferências via Pix!',
            url: window.location.href
        }).then(() => {
            console.log('Página compartilhada com sucesso!');
        }).catch((error) => {
            console.error('Erro ao compartilhar a página:', error);
        });
    } else {
        alert('Compartilhamento não suportado neste navegador.');
    }
}

// Close notification when clicking outside of it
document.addEventListener('click', function(event) {
    const notification = document.getElementById('notification');
    if (notification.classList.contains('show') && !notification.contains(event.target)) {
        closeNotification();
    }
});

function toggleOverlay(show) {
    const overlay = document.getElementById('overlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}
