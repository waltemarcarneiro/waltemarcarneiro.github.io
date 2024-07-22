let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBanner = document.getElementById('InstallBanner');
    installBanner.style.display = 'block'; // Mostrar nova div de instalação
});

document.getElementById('installButton').addEventListener('click', () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;

            // Fechar o banner de instalação após o clique
            closeApp();
        });
    }
});

function closeApp() {
    const installBanner = document.getElementById('InstallBanner');
    installBanner.style.display = 'none';
}

function showApp() {
    const app = document.getElementById('InstallBanner');
    app.classList.add('show');
    setTimeout(hideApp, 30000); // Esconde o banner após 30 segundos
}

function hideApp() {
    const app = document.getElementById('InstallBanner');
    app.classList.remove('show');
}

setTimeout(showApp, 5000); // Mostra o banner após 5 segundos
