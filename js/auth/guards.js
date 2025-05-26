import { auth } from '../../firebase-config.js';

export function setupAuthGuards() {
    document.addEventListener('click', (e) => {
        const element = e.target.closest('[data-auth-lock]');
        if (!element) return;

        if (!auth.currentUser) {
            e.preventDefault();
            showLoginModal();
            return false;
        }
    }, true);
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'flex';
}
