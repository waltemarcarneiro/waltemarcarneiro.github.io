//evento de compartilhamento        
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Experimente a Antena 1 com uma interface moderna e recursos interativos. Ouça música, veja letras originais e traduzidas, compartilhe sua experiência.',
            url: window.location.href
        }).then(() => {
            console.log('Página compartilhada com sucesso!');
        }).catch((error) => {
            console.error('Erro ao compartilhar a página:', error);
        });
    } else {
        alert('Compartilhamento não suportado neste navegador.');
    }
}

