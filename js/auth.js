import { GoogleAuthProvider, signInWithPopup, signOut, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    
    if (user) {
        userName.innerHTML = user.displayName || 'Usuário';
        userStatus.innerHTML = 'Você está logado';
        if (user.photoURL) {
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 10px;">`;
        }
    } else {
        userName.innerHTML = 'Usuário';
        userStatus.innerHTML = 'Faça login aquí';
    }
});

// Função de login com Google
window.loginWithGoogle = async function() {
    try {
        console.log('Iniciando login com Google...');
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        
        const result = await signInWithPopup(auth, provider);
        console.log('Login bem sucedido:', result.user);
        
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro no login:', error.code, error.message);
    }
}

// Função para fechar modal de login
window.closeLoginModal = function() {
    document.getElementById('loginModal').style.display = 'none';
}

// Função para fazer logout
window.fazerLogout = async function() {
    try {
        console.log('Iniciando logout...');
        await signOut(auth);
        console.log('Logout realizado com sucesso');
        const userName = document.querySelector('.user-name');
        const userStatus = document.querySelector('.user-status');
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};

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

// Intercepta clicks em links protegidos
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[data-auth-lock]');
    if (!link) return;

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'block';
        return false;
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

// Funções para alternar tabs
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${button.dataset.tab}-tab`).classList.add('active');
    });
});

// Login com email/senha
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (!userCredential.user.emailVerified) {
            await auth.signOut();
            showAuthMessage('Verifique seu email para continuar', 'error');
            showResendButton(email);
            return;
        }
        showAuthMessage('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            document.getElementById('loginModal').style.display = 'none';
        }, 1500);
    } catch (error) {
        showAuthMessage(getErrorMessage(error.code), 'error');
    }
});

// Função para exibir mensagens
function showAuthMessage(message, type) {
    const messageElement = document.getElementById('auth-message');
    messageElement.textContent = message;
    messageElement.className = `auth-message ${type}`;
}

// Função para mostrar botão de reenvio
function showResendButton(email) {
    const button = document.createElement('button');
    button.textContent = 'Reenviar email de verificação';
    button.onclick = () => resendVerificationEmail(email);
    document.getElementById('auth-message').appendChild(button);
}

// Função para reenviar email de verificação
async function resendVerificationEmail(email) {
    try {
        const user = auth.currentUser;
        await sendEmailVerification(user);
        showAuthMessage('Email de verificação reenviado!', 'success');
    } catch (error) {
        showAuthMessage('Erro ao reenviar email', 'error');
    }
}
