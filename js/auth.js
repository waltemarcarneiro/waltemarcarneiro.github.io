import { auth } from './firebase-config.js';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

// Verificação imediata ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    const isHomePage = window.location.pathname.includes('home.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname.endsWith('/');
                      
    // Não mostrar modal na home
    if (isHomePage) {
        document.getElementById('loginModal').style.display = 'none';
        return;
    }
});

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    const userIcon = document.querySelector('#user ion-icon[name="person-circle-outline"]');
    const loginModal = document.getElementById('loginModal');
    
    // Verifica se está na home
    const isHomePage = window.location.pathname.includes('home.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname.endsWith('/');

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
        
        // Não mostra modal na home
        if (isHomePage) {
            loginModal.style.display = 'none';
        }
    }
});

// Função para mostrar modal
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

// Função para mostrar modal de login
window.showLoginModal = function() {
    if (!auth.currentUser) {
        document.getElementById('loginModal').style.display = 'block';
    }
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
    // URLs que não requerem autenticação
    const freeAccessPaths = [
        '/home.html',
        '/bank/',
        'santander.html',
        '/',
        '#'
    ];

    // Verifica se a URL está na lista de exceções
    return !freeAccessPaths.some(path => url.toLowerCase().includes(path.toLowerCase()));
}

// Adicionar listener para clicks em links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const url = link.href;
    const isHomePage = window.location.pathname.includes('home.html') || 
                      window.location.pathname === '/' || 
                      window.location.pathname.endsWith('/');

    // Se estiver na home, permite navegação livre
    if (isHomePage && !requiresAuth(url)) {
        return;
    }

    // Se o link requer autenticação e usuário não está logado
    if (requiresAuth(url) && !auth.currentUser) {
        e.preventDefault();
        document.getElementById('loginModal').style.display = 'block';
    }
});

// Intercepta cliques em links
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    // Verifica se o link requer autenticação
    if (link.dataset.auth === 'required') {
        if (!auth.currentUser) {
            e.preventDefault();
            showLoginModal();
        }
    }
});

// Listener global para verificar cliques em elementos com data-auth
document.addEventListener('click', (e) => {
    const element = e.target.closest('[data-auth="required"]');
    if (!element) return;

    // Se usuário não estiver logado
    if (!auth.currentUser) {
        e.preventDefault();
        document.getElementById('loginModal').style.display = 'block';
        
        // Guarda a função original do onclick para executar após login
        const originalOnClick = element.getAttribute('onclick');
        if (originalOnClick) {
            sessionStorage.setItem('pendingAction', originalOnClick);
        }
    }
});

// Listener global para elementos com data-auth
document.addEventListener('click', (e) => {
    const element = e.target.closest('[data-auth="required"]');
    if (!element) return;

    if (!auth.currentUser) {
        e.preventDefault();
        e.stopPropagation(); // Impede a execução do onclick
        const originalFunction = element.getAttribute('onclick');
        if (originalFunction) {
            sessionStorage.setItem('pendingAction', originalFunction);
        }
        document.getElementById('loginModal').style.display = 'block';
        return false; // Impede a execução do evento padrão
    }
});

// Intercepta todos os cliques no documento
document.addEventListener('click', (e) => {
    const element = e.target.closest('[onclick]');
    if (!element) return;

    // Se elemento tiver data-auth-free, permite a execução
    if (element.hasAttribute('data-auth-free')) {
        return;
    }

    // Para todos os outros onclick, verifica autenticação
    if (!auth.currentUser) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('loginModal').style.display = 'block';
        return false;
    }
});
