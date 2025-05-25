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
    // Eventos das tabs
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            button.classList.add('active');
            document.getElementById(`${tabId}-tab`).style.display = 'block';
            document.getElementById('auth-message').style.display = 'none';
        });
    });

    // Fechar modal
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        document.getElementById('loginModal').style.display = 'none';
    });

    // Verificar parâmetros da URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'required') {
        const fromPage = params.get('from');
        document.getElementById('loginModal').style.display = 'block';
    }
});

// Função para mostrar formulário de reset de senha
window.showResetPassword = function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="resetEmail" class="form-input" 
               placeholder="Digite seu email" required>
        <button onclick="resetPassword()" class="login-btn">Enviar link</button>
        <button onclick="restoreLoginForm()" class="login-btn secondary">Voltar</button>
    `;
}

// Restaurar formulário de login
window.restoreLoginForm = function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="emailInput" class="form-input" 
               placeholder="Seu email" required>
        <input type="password" id="passwordInput" class="form-input" 
               placeholder="Sua senha" required>
        <button onclick="loginWithEmail()" class="login-btn">
            Entrar com Email
        </button>
        <div class="form-links">
            <a href="#" onclick="showResetPassword()">Esqueceu a senha?</a>
        </div>
    `;
}