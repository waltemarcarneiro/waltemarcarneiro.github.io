import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Switch entre abas
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.dataset.tab === tabId) btn.classList.add('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });

    document.getElementById(`${tabId}-tab`).style.display = 'block';
}

// Login com email (atualizado para lidar com usuários não verificados)
window.loginWithEmail = async function() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const messageEl = document.getElementById('auth-message');

    try {
        messageEl.textContent = 'Fazendo login...';
        messageEl.style.display = 'block';
        messageEl.className = 'auth-message info';

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
            messageEl.textContent = 'Verifique seu e-mail para continuar.';
            messageEl.className = 'auth-message error';
            await auth.signOut();
            showResendVerification(email);
            return;
        }

        messageEl.textContent = 'Login realizado com sucesso!';
        messageEl.className = 'auth-message success';
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error('Erro:', error);
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
        messageEl.style.display = 'block';
    }
}

// Mostrar botão para reenviar e-mail de verificação
function showResendVerification(email) {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <p>Verifique seu e-mail para continuar.</p>
        <button onclick="resendVerificationEmail('${email}')" class="resend-button">Reenviar e-mail de verificação</button>
        <a href="#" onclick="restoreLoginForm()">Voltar</a>
    `;
}

// Reenviar e-mail de verificação
window.resendVerificationEmail = async function(email) {
    const messageEl = document.getElementById('auth-message');
    try {
        const user = await signInWithEmailAndPassword(auth, email, 'dummyPassword');
        await sendEmailVerification(user.user);
        messageEl.textContent = 'E-mail enviado! Verifique sua caixa de entrada.';
        messageEl.className = 'auth-message success';
        await auth.signOut();
    } catch (error) {
        console.error('Erro:', error);
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
    }
}

// Criar conta
window.showCreateAccount = async function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="registerEmail" placeholder="Email" required class="form-input">
        <input type="password" id="registerPassword" placeholder="Senha" required class="form-input">
        <button type="button" onclick="createAccount()" class="register-btn">Criar Conta</button>
        <a href="#" onclick="restoreLoginForm()">Voltar</a>
    `;
}

// Função para criar conta
window.createAccount = async function() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageEl = document.getElementById('auth-message');

    try {
        messageEl.textContent = 'Criando conta...';
        messageEl.style.display = 'block';
        messageEl.className = 'auth-message info';

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);

        messageEl.textContent = 'Conta criada! Verifique seu email para ativar.';
        messageEl.className = 'auth-message success';

        setTimeout(() => restoreLoginForm(), 3000);

    } catch (error) {
        console.error('Erro:', error);
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
    }
}

// Redefinir senha
window.showResetPassword = function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="resetEmail" placeholder="Digite seu e-mail" required class="form-input">
        <button type="button" onclick="resetPassword()" class="register-btn">Redefinir senha</button>
        <a href="#" onclick="restoreLoginForm()">Voltar</a>
    `;
}

window.resetPassword = async function() {
    const email = document.getElementById('resetEmail').value;
    const messageEl = document.getElementById('auth-message');

    try {
        await sendPasswordResetEmail(auth, email);
        messageEl.textContent = 'Enviamos um link para redefinir sua senha.';
        messageEl.className = 'auth-message success';
    } catch (error) {
        console.error('Erro:', error);
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
    }
}

// Restaurar formulário de login
window.restoreLoginForm = function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="emailInput" placeholder="Email" required class="form-input">
        <input type="password" id="passwordInput" placeholder="Senha" required class="form-input">
        <button type="submit" onclick="loginWithEmail()" class="login-btn">Entrar</button>
        <div class="form-links">
            <a href="#" onclick="showCreateAccount()">Criar conta</a>
            <a href="#" onclick="showResetPassword()">Esqueceu a senha?</a>
        </div>
    `;
}

// Mensagens de erro em português
function getErrorMessage(code) {
    const messages = {
        'auth/email-already-in-use': 'Este email já está em uso',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operação não permitida',
        'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres',
        'auth/user-disabled': 'Esta conta foi desativada',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'default': 'Ocorreu um erro. Tente novamente.'
    };
    return messages[code] || messages.default;
}
