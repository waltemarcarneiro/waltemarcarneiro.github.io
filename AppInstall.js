// AppInstall.js

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  // Impede o prompt de instalação padrão do navegador
  event.preventDefault();
  // Guarda o evento para que possa ser acionado mais tarde
  deferredPrompt = event;
  // Exibe seu botão de instalação personalizado
  showInstallPromotion();
});

function showInstallPromotion() {
  const installBanner = document.getElementById('installBanner');
  installBanner.style.display = 'block';

  const installButton = document.getElementById('installButton');
  installButton.addEventListener('click', async () => {
    // Esconde o banner de instalação
    installBanner.style.display = 'none';
    // Mostra o prompt de instalação
    deferredPrompt.prompt();
    // Espera o usuário responder ao prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // Reseta a variável deferredPrompt
    deferredPrompt = null;
  });
}