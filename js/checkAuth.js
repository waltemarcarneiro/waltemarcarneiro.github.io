import { auth } from './firebase-config.js';

// Lista de páginas protegidas
const protectedPages = [
    '/radio/',
    '/videos/filmes.html',
    '/pages/profile'
];

// Verifica se a página atual precisa de autenticação
const currentPath = window.location.pathname;
const needsAuth = protectedPages.some(path => currentPath.includes(path));

if (needsAuth) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            const pageName = currentPath.split('/').pop().replace('.html', '');
            window.location.href = `/home.html?auth=required&from=${pageName}`;
        }
    });
}
