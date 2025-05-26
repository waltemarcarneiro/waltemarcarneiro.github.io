import { GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { auth } from '../../firebase-config.js';

export function initGoogleAuth() {
    window.loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                closeLoginModal();
            }
        } catch (error) {
            handleAuthError(error);
        }
    };
}

function handleAuthError(error) {
    console.error('Auth Error:', error);
    alert(getErrorMessage(error.code));
}

function getErrorMessage(code) {
    const messages = {
        'auth/cancelled-popup-request': 'Login cancelado pelo usuário',
        'auth/popup-closed-by-user': 'Janela de login fechada',
        'default': 'Erro ao fazer login. Tente novamente.'
    };
    return messages[code] || messages.default;
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'none';
}
