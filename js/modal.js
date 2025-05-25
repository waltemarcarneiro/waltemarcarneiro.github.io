// ...existing code...

window.openSantander = function() {
    fetch('./components/modals/modalSantander.html')
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML('beforeend', html);
            // Adiciona o evento após o modal ser carregado
            const btnEntendi = document.querySelector('.btn-entendi');
            if (btnEntendi) {
                btnEntendi.onclick = function() {
                    const mensagem = document.getElementById('mensagem');
                    mensagem.style.bottom = '-100%';
                };
            }
        });
}

window.copiarCodigo = function(codigo) {
    navigator.clipboard.writeText(codigo).then(() => {
        const mensagem = document.getElementById('mensagem');
        // Mostra mensagem QR Code e esconde a outra
        document.getElementById('mensagemQRCode').style.display = 'block';
        document.getElementById('mensagemChave').style.display = 'none';
        mensagem.style.display = 'block';
        setTimeout(() => {
            mensagem.style.bottom = '0';
        }, 10);
    });
}

window.copiarChave = function(chave) {
    navigator.clipboard.writeText(chave).then(() => {
        const mensagem = document.getElementById('mensagem');
        // Mostra mensagem Chave e esconde a outra
        document.getElementById('mensagemChave').style.display = 'block';
        document.getElementById('mensagemQRCode').style.display = 'none';
        mensagem.style.display = 'block';
        setTimeout(() => {
            mensagem.style.bottom = '0';
        }, 10);
    });
}

// Adicionar event listeners para as tabs
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para as tabs
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Remove classe active de todas as tabs
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Ativa a tab clicada
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
            
            // Limpa mensagens de erro ao trocar de tab
            document.getElementById('auth-message').style.display = 'none';
        });
    });

    // Limpa mensagens ao fechar modal
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('auth-message').style.display = 'none';
    });
});