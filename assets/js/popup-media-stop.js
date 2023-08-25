// Inicialize o plyr para todos os elementos de vídeo e iframes
        const players = Plyr.setup('.content');

        // Feche o popup e pare o vídeo quando o botão Fechar é clicado
        function closePopup(popupId) {
            const popup = document.getElementById(popupId);
            popup.style.display = 'none';
            
            // Pausa o vídeo associado ao popup fechado
            players.forEach(player => {
                if (player.getEmbed() && player.getEmbed().parentElement.id === popupId) {
                    player.pause();
                }
            });
        }