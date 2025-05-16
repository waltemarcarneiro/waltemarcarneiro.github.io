import { GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    
    if (user) {
        userName.textContent = user.displayName || 'Usuário';
        userStatus.textContent = 'Você está logado';
        if (user.photoURL) {
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 10px;">`;
        }
    } else {
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
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
