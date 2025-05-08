import { auth } from './firebase-config.js';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';

// Verificação imediata ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Verifica estado inicial de autenticação
    const user = auth.currentUser;
    if (!user) {
        // Se não estiver logado, mostra o modal
        document.getElementById('loginModal').style.display = 'block';
    }
});

// Monitora mudanças no estado de autenticação
auth.onAuthStateChanged((user) => {
    const userName = document.querySelector('.user-name');
    const userInfo = document.querySelector('.user-info');
    const loginModal = document.getElementById('loginModal');
    
    if (user) {
        // Usuário está logado
        userName.textContent = user.displayName || 'Usuário';
        userInfo.textContent = 'Logado';
        loginModal.style.display = 'none';
    } else {
        // Usuário não está logado
        userName.textContent = 'Usuário';
        userInfo.textContent = 'Área de Membros';
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
        document.getElementById('loginModal').style.display = 'block';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
};
