import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateProfile 
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
