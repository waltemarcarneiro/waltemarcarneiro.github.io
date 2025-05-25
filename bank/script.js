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
            text: '👉 Link de pagamentos e Transferências via Pix!',
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

//UPDATE PAGE

let startY = 0;

// Detecta o início do gesto
document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
}, { passive: true });

// Detecta o movimento
document.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;

    // Verifica se o gesto foi de cima para baixo e no topo da página
    if (currentY - startY > 50 && window.scrollY === 0) {
        // Seta um indicador no localStorage
        localStorage.setItem('pageRefreshed', 'true');
        // Atualiza a página
        location.reload();
    }
}, { passive: true });

// Verifica se a página foi recarregada
window.addEventListener('load', () => {
    if (localStorage.getItem('pageRefreshed') === 'true') {
        // Mostra a mensagem
        const message = document.createElement('div');
        message.textContent = 'Seção atualizada!';
        message.style.position = 'fixed';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        message.style.color = '#fff';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '5px';
        message.style.zIndex = '9999';
        message.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(message);

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            document.body.removeChild(message);
            // Limpa o indicador do localStorage
            localStorage.removeItem('pageRefreshed');
        }, 3000);
    }
});
