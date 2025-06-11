// Função para verificar se é primeira entrada no PWA
function isFirstPWAEntry() {
  // Verifica se veio de outra página do mesmo site
  if (document.referrer && document.referrer.includes(window.location.host)) {
    return false;
  }

  // Verifica se já mostrou splash nesta sessão
  if (sessionStorage.getItem('splashShown')) {
    return false;
  }

  // Verifica se é a primeira vez ou nova sessão
  return !localStorage.getItem('splashShown');
}

// Carrega a splash apenas na primeira entrada
if (isFirstPWAEntry()) {
  fetch('/components/modals/splash.html')
    .then(response => response.text())
    .then(html => {
      document.body.insertAdjacentHTML('afterbegin', html);

      window.addEventListener('load', () => {
        const splash = document.getElementById('splash-preloader');
        splash.classList.add('splash-loaded');

        setTimeout(() => {
          splash.remove();
          // Marca que já mostrou a splash
          sessionStorage.setItem('splashShown', 'true');
          localStorage.setItem('splashShown', 'true');
        }, 1500);
      });
    });
}

// Limpa o controle quando o PWA é fechado
window.addEventListener('unload', () => {
  localStorage.removeItem('splashShown');
});

///

splash.remove();
sessionStorage.setItem('splashShown', 'true');
localStorage.setItem('splashShown', 'true');
document.body.style.visibility = 'visible'; // 👈 ATIVA VISUALIZAÇÃO


// ⚠️ Libera a verificação de proteção
if (typeof iniciarProtecaoGlobal === "function") {
  iniciarProtecaoGlobal();
}
