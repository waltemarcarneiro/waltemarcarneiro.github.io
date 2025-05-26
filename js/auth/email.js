import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile,
    sendPasswordResetEmail 
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { auth } from '../../firebase-config.js';

export function initEmailAuth() {
    window.loginWithEmail = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            closeLoginModal();
        } catch (error) {
            handleAuthError(error);
        }
    };

    window.createAccount = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            closeLoginModal();
        } catch (error) {
            handleAuthError(error);
        }
    };
}

// Função para recuperação de senha
export function initPasswordReset() {
    window.resetPassword = async (email) => {
        if (!email) {
            showMessage('Por favor, informe seu email', 'error');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            showMessage('Email de recuperação enviado! Verifique sua caixa de entrada.', 'success');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            showMessage(getErrorMessage(error.code), 'error');
        }
    };
}

function getErrorMessage(code) {
    const messages = {
        'auth/user-not-found': 'Email não encontrado.',
        'auth/invalid-email': 'Email inválido.',
        'default': 'Erro ao enviar email de recuperação.'
    };
    return messages[code] || messages.default;
}

function handleAuthError(error) {
    const messages = {
        'auth/email-already-in-use': 'Email já está em uso',
        'auth/invalid-email': 'Email inválido',
        'auth/weak-password': 'Senha muito fraca',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'default': 'Erro na autenticação'
    };
    alert(messages[error.code] || messages.default);
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}

function showMessage(message, type) {
    const authMessage = document.getElementById('auth-message');
    if (authMessage) {
        authMessage.textContent = message;
        authMessage.className = `auth-message ${type}`;
        authMessage.style.display = 'block';
        setTimeout(() => {
            authMessage.style.display = 'none';
        }, 3000);
    }
}
