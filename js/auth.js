import { signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js';
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
            userIcon.outerHTML = `<img src="${user.photoURL}" alt="Foto do perfil" style="width: 56px; height: 56px; border-radius: 50%; margin-right: 5px;">`;
        }
    } else {
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Status';
    }
});

// Login com Google
window.loginWithGoogle = async function() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        if (result.user) {
            document.getElementById('loginModal').style.display = 'none';
        }
    } catch (error) {
        console.error('Erro no login:', error);
    }
}

// Logout
window.fazerLogout = async function() {
    try {
        await signOut(auth);
        document.getElementById('loginModal').style.display = 'none';
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
