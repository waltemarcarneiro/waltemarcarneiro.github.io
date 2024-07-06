// backgroundAudio.js

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});
