// audioCapture.js

let audioContext;
let source;
let gainNode;
let playerElement = document.getElementById('music-player');

function captureAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(playerElement);
    gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Resume audio context when tab is visible again
        audioContext.resume();
    }
});

// Initialize audio capture when the player is ready
function onPlayerReady(event) {
    captureAudio();

    document.getElementById('play-pause').addEventListener('click', function() {
        if (isPlaying) {
            player.pauseVideo();
            this.innerHTML = '<i class="fas fa-play"></i>';
            audioContext.suspend();
        } else {
            player.playVideo();
            this.innerHTML = '<i class="fas fa-pause"></i>';
            audioContext.resume();
        }
        isPlaying = !isPlaying;
    });

    // Resto do seu código onPlayerReady...
}
