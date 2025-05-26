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

// Inicializa o modal de login
auth.onAuthStateChanged(async (user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');

    if (user) {
        if (!user.emailVerified) {
            showAuthMessage('Verifique seu email antes de continuar.', 'error');
            await signOut(auth);
            return;
        }

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
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        // Envia email de verificação
        await user.sendEmailVerification();

        showAuthMessage('Conta criada! Verifique seu email antes de usar.', 'success');

        // Desloga o usuário até ele verificar o e-mail
        await signOut(auth);

        hideLoginModal();
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

// Funções de UI
window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
}

function hideLoginModal() {
    closeLoginModal();
}

// Funções auxiliares
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

// Intercepta clicks para verificar autenticação
document.addEventListener('click', function(e) {
    const clickedElement = e.target.closest('[onclick]');
    if (!clickedElement) return;

    if (clickedElement.hasAttribute('data-auth-free')) {
        return;
    }

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'block';
        return false;
    }
}, true);

// Proteção de rotas e elementos com data-auth-lock
document.addEventListener('click', (e) => {
    const element = e.target.closest('[data-auth-lock]');
    
    // Se não encontrou elemento com data-auth-lock ou tem data-auth-free, ignora
    if (!element || element.hasAttribute('data-auth-free')) return;
    
    // Se não estiver logado, mostra o modal
    if (!auth.currentUser) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'flex';
    }
}, true);

// Verifica parâmetros da URL ao carregar
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'required') {
        const fromPage = params.get('from');
        const loginModal = document.getElementById('loginModal');
        const message = `Você precisa fazer login para acessar ${fromPage}`;
        
        if (loginModal) {
            const modalMessage = loginModal.querySelector('p');
            if (modalMessage) modalMessage.textContent = message;
            loginModal.style.display = 'block';
        }
    }
});

// Função para reenviar o e-mail de verificação
import { sendEmailVerification } from 'https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js';

window.enviarEmailVerificacao = async () => {
    const user = auth.currentUser;

    if (user && !user.emailVerified) {
        try {
            await sendEmailVerification(user);
            showAuthMessage('Email de verificação enviado!', 'success');
        } catch (error) {
            showAuthError(error);
        }
    } else {
        showAuthMessage('Usuário já verificado ou não logado.', 'error');
    }
}
