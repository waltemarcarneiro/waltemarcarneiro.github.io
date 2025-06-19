//evento de compartilhamento        
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: '👉 Link de pagamentos e Transferências via Pix!',
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

