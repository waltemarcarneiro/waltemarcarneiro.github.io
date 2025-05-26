import { GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
import { auth } from '../firebase-config.js';

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

// Exporta funções de autenticação
export const loginWithGoogle = async () => {
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
export const closeLoginModal = () => {
    document.getElementById('loginModal').style.display = 'none';
}

// Função para fazer logout
export const fazerLogout = async () => {
    try {
        await signOut(auth);
        console.log('Logout realizado com sucesso');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Intercepta clicks para verificar autenticação
document.addEventListener('click', function(e) {
    const clickedElement = e.target.closest('[onclick], [data-auth-lock]');
    if (!clickedElement) return;

    if (clickedElement.hasAttribute('data-auth-free')) {
        return;
    }

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopImmediatePropagation();
        document.getElementById('loginModal').style.display = 'flex';
        return false;
    }
}, true);

// Atribui funções ao objeto window para acesso global
window.loginWithGoogle = loginWithGoogle;
window.closeLoginModal = closeLoginModal;
window.fazerLogout = fazerLogout;
