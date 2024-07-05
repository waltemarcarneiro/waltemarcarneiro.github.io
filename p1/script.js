document.getElementById('theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    this.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

let player = document.getElementById('music-player');
let isPlaying = false;

document.getElementById('play-pause').addEventListener('click', function() {
    if (isPlaying) {
        player.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        this.innerHTML = '<i class="fas fa-play"></i>';
    } else {
        player.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        this.innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
});

document.getElementById('prev').addEventListener('click', function() {
    player.contentWindow.postMessage('{"event":"command","func":"previousVideo","args":""}', '*');
});

document.getElementById('next').addEventListener('click', function() {
    player.contentWindow.postMessage('{"event":"command","func":"nextVideo","args":""}', '*');
});

document.getElementById('stop').addEventListener('click', function() {
    player.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
});

document.getElementById('mute').addEventListener('click', function() {
    player.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
});
