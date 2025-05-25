import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Função para mostrar mensagem de feedback
function showMessage(message, type = 'info') {
    const messageEl = document.getElementById('auth-message');
    messageEl.textContent = message;
    messageEl.className = `auth-message ${type}`;
    messageEl.style.display = 'block';
}

// Criar conta
window.createAccount = async function() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    // Validação básica
    if (!name || !email || !password) {
        showMessage('Por favor, preencha todos os campos', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres', 'error');
        return;
    }

    try {
        showMessage('Criando sua conta...', 'info');
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        
        showMessage('Conta criada! Verifique seu email para ativar.', 'success');
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click(); // Volta para aba de login
        }, 2000);
    } catch (error) {
        console.error('Erro:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Redefinir senha
window.showResetPassword = function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="resetEmail" class="form-input" 
               placeholder="Digite seu email" required>
        <button onclick="resetPassword()" class="login-btn">Enviar link</button>
        <button onclick="restoreLoginForm()" class="login-btn secondary">Voltar</button>
    `;
}

// Função para redefinir senha
window.resetPassword = async function() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showMessage('Digite seu email', 'error');
        return;
    }

    try {
        showMessage('Enviando email...', 'info');
        await sendPasswordResetEmail(auth, email);
        showMessage('Email enviado! Verifique sua caixa de entrada.', 'success');
    } catch (error) {
        console.error('Erro:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
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

// Tradução das mensagens de erro
function getErrorMessage(code) {
    const messages = {
        'auth/email-already-in-use': 'Este email já está em uso',
        'auth/invalid-email': 'Email inválido',
        'auth/weak-password': 'Senha muito fraca',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'default': 'Ocorreu um erro. Tente novamente.'
    };
    return messages[code] || messages.default;
}
