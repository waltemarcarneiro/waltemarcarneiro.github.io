document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('playlistModal');
    const addPlaylistBtn = document.getElementById('addPlaylistBtn');
    const closeModal = document.getElementById('closeModal');
    const savePlaylist = document.getElementById('savePlaylist');
    const playlistInput = document.getElementById('playlistId');
    const youtubeIframe = document.getElementById('youtube-iframe');

    // Abrir modal
    addPlaylistBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Fechar modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar fora
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Salvar nova playlist
    savePlaylist.addEventListener('click', () => {
        const playlistId = playlistInput.value.trim();
        if (playlistId) {
            youtubeIframe.src = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
            modal.style.display = 'none';
            playlistInput.value = '';
        }
    });

    function loadPlaylist(playlistId) {
        if (player) {
            // Carregar a playlist no player
            player.loadPlaylist({
                list: playlistId,
                listType: 'playlist'
            });
            
            // Mostrar o container do YouTube
            document.getElementById('youtube-container').style.display = 'block';
            document.getElementById('playlists-container').style.display = 'none';
            
            // Iniciar a reprodução
            player.playVideo();
        } else {
            console.error('Player do YouTube não está inicializado');
        }
    }

    // Tornar a função disponível globalmente
    window.loadPlaylist = loadPlaylist;
});

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        playerVars: {
            'playsinline': 1,
            'controls': 1,
            'enablejsapi': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Player está pronto
    console.log('Player está pronto');
}

function onPlayerStateChange(event) {
    // Atualizar interface quando o estado do player mudar
    updatePlayerControls(event.data);
} 