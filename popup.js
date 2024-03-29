document.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('open-button');
    const popupOverlay = document.getElementById('popup-overlay');
    const popup = document.getElementById('popup');
    const closeButton = document.getElementById('close-button');

    openButton.addEventListener('click', () => {
        popupOverlay.style.display = 'flex'; // Mostra o popup
    });

    closeButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none'; // Esconde o popup
    });

    popupOverlay.addEventListener('click', (event) => {
        if (event.target === popupOverlay) {
            popupOverlay.style.display = 'none';
        }
    });

    // Mostra automaticamente o popup ao carregar a página
    popup.style.display = 'block';
});
