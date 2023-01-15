const divInstall = document.getElementById('installContainer');
const butInstall = document.getElementById('butInstall');

/* Put code here */
window.addEventListener('beforeinstallprompt', (event)=>{
    // Impedir que o mini-infobar apareça no celular.
    event.preventDefault();
    console.log('👍', 'beforeinstallprompt', event);
    // Esconder o evento para que possa ser acionado mais tarde.
    window.deferredPrompt = event;
    // Remover a classe 'oculta' do contêiner do botão de instalação.
    divInstall.classList.toggle('hidden', false);
}
);

butInstall.addEventListener('click', async()=>{
    console.log('👍', 'butInstall-clicked');
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
        // The deferred prompt isn't available.
        return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log('👍', 'userChoice', result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
    divInstall.classList.toggle('hidden', true);
}
);

window.addEventListener('appinstalled', (event)=>{
    console.log('👍', 'appinstalled', event);
    // Limpa o deferredPrompt para que possa ser coletado como lixo
    window.deferredPrompt = null;
}
);

/* Only register a service worker if it's supported */
if ('serviceWorker'in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

/**
 * Warn the page must be served over HTTPS
 * The `beforeinstallprompt` event won't fire if the page is served over HTTP.
 * Installability requires a service worker with a fetch event handler, and
 * if the page isn't served over HTTPS, the service worker won't load.
 */
if (window.location.protocol === 'http:') {
    const requireHTTPS = document.getElementById('requireHTTPS');
    const link = requireHTTPS.querySelector('a');
    link.href = window.location.href.replace('http://', 'https://');
    requireHTTPS.classList.remove('hidden');
}
