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

function initAudio() {
    if (!audioContext) {
        captureAudio();
    }
}
