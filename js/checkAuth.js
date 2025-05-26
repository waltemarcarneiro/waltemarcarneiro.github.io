import { auth } from '../firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { setupAuthGuard } from './authGuard.js';

// Lista de páginas protegidas
const protectedPages = [
    '/radio/',
    '/videos/filmes.html',
    '/pages/profile'
];

const currentPath = window.location.pathname;
const needsAuth = protectedPages.some(path => currentPath.includes(path));

export const initAuthCheck = () => {
  setupAuthGuard(); // Inicializa o guard de autenticação
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Usuário autenticado:", user.email);
      localStorage.setItem("usuarioLogado", "true");
      // Oculta o modal de login se estiver visível
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.style.display = 'none';
    } else {
      localStorage.removeItem("usuarioLogado");
      
      // Se estiver em uma página protegida, mostra o modal
      if (needsAuth) {
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.style.display = 'flex';
          // Dispara evento customizado
          document.dispatchEvent(new CustomEvent('authRequired'));
        }
      }
    }
  });
};

// Remove o event listener duplicado
// document.addEventListener("DOMContentLoaded", initAuthCheck);
