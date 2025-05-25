import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Função para alternar entre as tabs
window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(`${tabId}-tab`).style.display = 'block';
}

// Login com email
window.loginWithEmail = async function() {
    const messageEl = document.getElementById('auth-message');
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        messageEl.textContent = 'Fazendo login...';
        messageEl.className = 'auth-message info';
        messageEl.style.display = 'block';

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!userCredential.user.emailVerified) {
            await auth.signOut();
            showVerificationMessage(email);
            return;
        }

        messageEl.textContent = 'Login realizado com sucesso!';
        messageEl.className = 'auth-message success';
        setTimeout(() => closeLoginModal(), 1500);

    } catch (error) {
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
    }
}

// Criar conta
window.createAccount = async function() {
    const messageEl = document.getElementById('auth-message');
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        messageEl.textContent = 'Criando conta...';
        messageEl.className = 'auth-message info';
        messageEl.style.display = 'block';

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        await sendEmailVerification(userCredential.user);
        await auth.signOut();

        showVerificationMessage(email);

    } catch (error) {
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
    }
}

// Redefinir senha
window.showResetPassword = function() {
    const loginForm = document.getElementById('loginForm');
    loginForm.innerHTML = `
        <input type="email" id="resetEmail" class="form-input" 
               placeholder="Digite seu email" required>
        <button onclick="resetPassword()" class="login-btn">Enviar link de redefinição</button>
        <button onclick="restoreLoginForm()" class="login-btn secondary">Voltar</button>
    `;
}

// Enviar email de redefinição de senha
window.resetPassword = async function() {
    const email = document.getElementById('resetEmail').value;
    const messageEl = document.getElementById('auth-message');

    try {
        messageEl.textContent = 'Enviando email de redefinição...';
        messageEl.className = 'auth-message info';
        messageEl.style.display = 'block';

        await sendPasswordResetEmail(auth, email);

        messageEl.textContent = 'Email de redefinição enviado! Verifique sua caixa de entrada.';
        messageEl.className = 'auth-message success';

        setTimeout(() => restoreLoginForm(), 3000);

    } catch (error) {
        messageEl.textContent = getErrorMessage(error.code);
        messageEl.className = 'auth-message error';
    }
}

// Mostrar mensagem de verificação
function showVerificationMessage(email) {
    const messageEl = document.getElementById('auth-message');
    messageEl.innerHTML = `Conta criada com sucesso! Verifique seu email (${email}) para ativar sua conta.`;
    messageEl.className = 'auth-message success';
    messageEl.style.display = 'block';
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
