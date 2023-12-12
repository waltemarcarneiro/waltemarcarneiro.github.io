document.addEventListener('DOMContentLoaded', () => {
            const openButton = document.getElementById('open-button');
            const popupOverlay = document.getElementById('popup-overlay');
            const popup = document.getElementById('popup');
            const closeButton = document.getElementById('close-button');

            closeButton.addEventListener('click', () => {
                popupOverlay.style.display = 'none';
            });

            popupOverlay.addEventListener('click', (event) => {
                if (event.target === popupOverlay) {
                    popupOverlay.style.display = 'none';
                }
            });

            // Verifica se o popup já foi exibido
            const popupShown = localStorage.getItem('popupShown');

            if (!popupShown) {
                // Mostra automaticamente o popup ao carregar a página
                popupOverlay.style.display = 'flex';
                // Marca que o popup foi exibido
                localStorage.setItem('popupShown', 'true');
            } else {
                // Se o popup já foi exibido, oculta o overlay
                popupOverlay.style.display = 'none';
            }
        });