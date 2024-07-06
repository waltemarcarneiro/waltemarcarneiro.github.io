// recuperaPlayer.js

// Armazenar o estado do player no localStorage quando a página for descarregada
window.addEventListener('beforeunload', () => {
    if (player) {
        localStorage.setItem('playerState', JSON.stringify({
            currentTime: player.getCurrentTime(),
            videoId: player.getVideoData().video_id,
            isPlaying: isPlaying
        }));
    }
});

// Restaurar o estado do player quando a página for recarregada e continuar a reprodução
function onPlayerReady(event) {
    // Código existente...

    // Restaurar o estado do player se disponível
    const savedPlayerState = JSON.parse(localStorage.getItem('playerState'));
    if (savedPlayerState) {
        player.loadVideoById({
            videoId: savedPlayerState.videoId,
            startSeconds: savedPlayerState.currentTime
        });

        if (savedPlayerState.isPlaying) {
            player.playVideo();
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        } else {
            document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        }
    }

    // Código existente...
}
