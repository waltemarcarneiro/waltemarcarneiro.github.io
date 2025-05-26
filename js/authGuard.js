export function setupAuthGuard() {
  // Intercepta cliques em elementos com data-auth-lock
  document.addEventListener('click', (e) => {
    const element = e.target.closest('[data-auth-lock]');
    if (element) {
      e.preventDefault();
      
      // Verifica se usuário está logado
      const isLoggedIn = localStorage.getItem("usuarioLogado") === "true";
      
      if (!isLoggedIn) {
        // Mostra o modal de login
        const loginModal = document.getElementById('loginModal');
        if (loginModal) {
          loginModal.style.display = 'flex';
        }
        return false;
      }
      
      // Se estiver logado, permite a ação original
      if (element.tagName === 'A') {
        window.location.href = element.href;
      } else if (element.onclick) {
        element.onclick.apply(element);
      }
    }
  });
}
