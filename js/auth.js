import { 
    GoogleAuthProvider, 
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';
import { auth } from '../firebase-config.js';

// Monitor de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    
    if (user) {
        userName.textContent = user.displayName || 'Usuário';
        userStatus.textContent = 'Você está logado';
        if (user.photoURL) {
            const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
            if (userIcon) {
                userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 10px;">`;
            }
        }
    } else {
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
    }
});

// Funções de autenticação
window.loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            hideLoginModal();
        }
    } catch (error) {
        showAuthError(error);
    }
}

window.loginWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        if (result.user) {
            hideLoginModal();
        }
    } catch (error) {
        showAuthError(error);
    }
}

window.createAccount = async (email, password, name) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        hideLoginModal();
        showAuthMessage('Conta criada com sucesso!', 'success');
    } catch (error) {
        showAuthError(error);
    }
}

window.resetPassword = async (email) => {
    if (!email) {
        showAuthMessage('Digite seu email primeiro', 'error');
        return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        showAuthMessage('Email de recuperação enviado!', 'success');
    } catch (error) {
        showAuthError(error);
    }
}

window.fazerLogout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Funções do modal
window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
}

window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Funções auxiliares
function hideLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
}

function showAuthMessage(message, type) {
    const msgElement = document.getElementById('auth-message');
    msgElement.textContent = message;
    msgElement.className = `auth-message ${type}`;
    msgElement.style.display = 'block';
    setTimeout(() => msgElement.style.display = 'none', 3000);
}

function showAuthError(error) {
    const messages = {
        'auth/email-already-in-use': 'Este email já está em uso',
        'auth/invalid-email': 'Email inválido',
        'auth/operation-not-allowed': 'Operação não permitida',
        'auth/weak-password': 'Senha muito fraca',
        'auth/user-disabled': 'Usuário desativado',
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/popup-closed-by-user': 'Login cancelado'
    };
    showAuthMessage(messages[error.code] || error.message, 'error');
}

// Proteção de rotas (substituiu o guards.js)
document.addEventListener('click', (e) => {
    const element = e.target.closest('[data-auth-lock]');
    if (!element || element.hasAttribute('data-auth-free')) return;
    
    if (!auth.currentUser) {
        e.preventDefault();
        document.getElementById('loginModal').style.display = 'flex';
    }
}, true);