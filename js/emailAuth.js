import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Alternar entre abas
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        const tab = button.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
        
        button.classList.add('active');
        document.getElementById(`${tab}-tab`).style.display = 'block';
    });
});

// Login com email/senha
window.loginWithEmail = async () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const messageDiv = document.getElementById('auth-message');

    try {
        messageDiv.textContent = 'Fazendo login...';
        messageDiv.className = 'auth-message info';
        messageDiv.style.display = 'block';

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        messageDiv.textContent = 'Login realizado com sucesso!';
        messageDiv.className = 'auth-message success';
        
        setTimeout(() => {
            document.getElementById('loginModal').style.display = 'none';
            window.location.reload();
        }, 1500);

    } catch (error) {
        messageDiv.textContent = getErrorMessage(error.code);
        messageDiv.className = 'auth-message error';
        messageDiv.style.display = 'block';
    }
};

function getErrorMessage(code) {
    const messages = {
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Conta desativada',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'default': 'Erro ao fazer login'
    };
    return messages[code] || messages.default;
}
