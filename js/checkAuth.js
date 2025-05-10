import { auth } from './firebase-config.js';

// Lista de páginas protegidas
const protectedPages = [
    '/radio/',
    '/videos/filmes.html'
];

// Verifica se a página atual está na lista de protegidas
const currentPath = window.location.pathname;
const needsAuth = protectedPages.some(path => currentPath.includes(path));

// Verifica autenticação apenas se for página protegida
if (needsAuth) {
    auth.onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = '/home.html';
        }
    });
}
