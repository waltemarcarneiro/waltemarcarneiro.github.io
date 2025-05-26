import { auth } from '../../firebase-config.js';
import { initGoogleAuth } from './google.js';
import { initEmailAuth } from './email.js';
import { setupAuthGuards } from './guards.js';

export function initAuth() {
    // Monitor de estado
    auth.onAuthStateChanged((user) => {
        if (user) {
            localStorage.setItem('usuarioLogado', 'true');
            updateUserUI(user);
        } else {
            localStorage.removeItem('usuarioLogado');
            resetUserUI();
        }
    });

    // Inicializa componentes
    initGoogleAuth();
    initEmailAuth();
    setupAuthGuards();
}

function updateUserUI(user) {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    if (userName && userStatus) {
        userName.textContent = user.displayName || 'Usuário';
        userStatus.textContent = 'Você está logado';
    }
}

function resetUserUI() {
    const userName = document.querySelector('.user-name');
    const userStatus = document.querySelector('.user-status');
    if (userName && userStatus) {
        userName.textContent = 'Usuário';
        userStatus.textContent = 'Faça login aquí';
    }
}
