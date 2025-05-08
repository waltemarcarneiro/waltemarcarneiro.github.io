import { auth } from './firebase-config.js';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

// Verificação imediata ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está na home
    const isHomePage = window.location.pathname.includes('home.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname.endsWith('/');
    
    // Se não estiver na home, verifica autenticação
    if (!isHomePage && !auth.currentUser) {
        document.getElementById('loginModal').style.display = 'block';
    }
});

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    const loginModal = document.getElementById('loginModal');
    
    if (user) {
        // Usuário está logado
        userName.textContent = user.displayName || 'Usuário';
        userStatus.textContent = 'Você está logado';
        
        // Se o usuário tem foto de perfil, substitui o ícone pela foto
        if (user.photoURL) {
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 5px;">`;
        }
        
        loginModal.style.display = 'none';
    } else {
        // Usuário não está logado
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Status';
        
        // Restaura o ícone padrão
        if (!userIcon) {
            const userDiv = document.querySelector('#user div').previousElementSibling;
            userDiv.outerHTML = '<ion-icon style="font-size: 56px; margin-right: 5px;" name="person-circle-outline"></ion-icon>';
        }
        
        loginModal.style.display = 'block';
    }
});

// Função para mostrar modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

// Função para fazer login com Google
window.loginWithGoogle = async function() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        console.error('Erro no login:', error);
    }
};

// Função para fazer logout
window.fazerLogout = async function() {
    try {
        await signOut(auth);
        // Não mostra o modal após logout
        document.getElementById('loginModal').style.display = 'none';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};

// Função para verificar se o link requer autenticação
function requiresAuth(url) {
    // Lista de caminhos que não requerem autenticação
    const freeAccessPaths = [
        '/home.html',
        '/bank/',
        '/',
        '#logo',
        '#options',
        '#about'
    ];

    // Permite navegação livre na home e seus anchors
    if (window.location.pathname.includes('home.html')) {
        return false;
    }

    return !freeAccessPaths.some(path => url.includes(path));
}

// Adicionar listener para clicks em links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Ignora links da home
    if (window.location.pathname.includes('home.html')) {
        return;
    }

    const url = link.href;
    if (requiresAuth(url) && !auth.currentUser) {
        e.preventDefault();
        document.getElementById('loginModal').style.display = 'block';
    }
});

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    
    if (user) {
        // Usuário está logado
        userName.textContent = user.displayName || 'Usuário';
        userStatus.textContent = 'Você está logado';
        
        if (user.photoURL) {
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 5px;">`;
        }
    } else {
        // Usuário não está logado
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Status';
        
        if (!userIcon) {
            const userDiv = document.querySelector('#user div').previousElementSibling;
            userDiv.outerHTML = '<ion-icon style="font-size: 56px; margin-right: 5px;" name="person-circle-outline"></ion-icon>';
        }
    }
});
