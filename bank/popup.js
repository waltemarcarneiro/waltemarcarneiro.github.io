document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('open-button');
    const popupOverlay = document.getElementById('popup-overlay');
    const popup = document.getElementById('popup');
    const closeButton = document.getElementById('close-button');

    closeButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none'; // Esconde o popup
    });

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    // Mostra automaticamente o popup ao carregar a página
    popupOverlay.style.display = 'flex'; // ou 'block', dependendo do seu layout
    
    // localStorage config
    
    // Verifica se a div já foi exibida anteriormente
    if (!localStorage.getItem('bannerDisplayed')) {
        // Adiciona um atraso de 5 segundos antes de mostrar a div
        setTimeout(function () {
            // Armazena a informação de que a div foi exibida
            localStorage.setItem('bannerDisplayed', true);
        }, 5000); // 5000 milissegundos = 5 segundos
    } else {
        // Se a div já foi exibida anteriormente, oculta a div
        popupOverlay.style.display = 'none';
    }
});
