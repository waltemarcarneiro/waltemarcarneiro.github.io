let player;
let isPlaying = false;
let isShuffle = false;
let mode = 'repeat'; // 'repeat', 'repeat_one', 'shuffle'
let progressBar, currentTimeDisplay, durationDisplay;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('music-player', {
        height: '315',
        width: '100%',
        videoId: 'xiN4EOqpvwc',
        playerVars: {
            'listType': 'playlist',
            'list': 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5',
            'autoplay': 0,
            'controls': 0,
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    progressBar = document.getElementById('progress');
    currentTimeDisplay = document.getElementById('current-time');
    durationDisplay = document.getElementById('duration');
    
    onYouTubeIframeAPIReady();
});

function onPlayerReady(event) {
    document.getElementById('play-pause').addEventListener('click', function() {
        if (isPlaying) {
            player.pauseVideo();
            this.innerHTML = '<ion-icon name="play-outline"></ion-icon>';
        } else {
            player.playVideo();
            this.innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
        }
        isPlaying = !isPlaying;
    });

    document.getElementById('prev').addEventListener('click', function() {
        player.previousVideo();
    });

    document.getElementById('next').addEventListener('click', function() {
        player.nextVideo();
    });

    document.getElementById('repeat').addEventListener('click', function() {
        switch (mode) {
            case 'repeat':
                mode = 'repeat_one';
                this.innerHTML = '<ion-icon name="repeat-outline"></ion-icon><span class="repeat-number">1</span>';
                player.setLoop(true);
                break;
            case 'repeat_one':
                mode = 'shuffle';
                this.innerHTML = '<ion-icon name="shuffle-outline"></ion-icon>';
                player.setShuffle(true);
                break;
            case 'shuffle':
                mode = 'repeat';
                this.innerHTML = '<ion-icon name="repeat-outline"></ion-icon>';
                player.setLoop(false);
                player.setShuffle(false);
                break;
        }
    });

    document.getElementById('shuffle').addEventListener('click', function() {
        isShuffle = !isShuffle;
        player.setShuffle(isShuffle);
        this.innerHTML = isShuffle ? '<ion-icon name="shuffle-outline"></ion-icon>' : '<ion-icon name="shuffle-outline"></ion-icon>';
    });

    player.addEventListener('onStateChange', function(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            const duration = player.getDuration();
            durationDisplay.textContent = formatTime(duration);
            updateProgressBar();
        }
    });

    progressBar.addEventListener('input', function() {
        const seekTo = player.getDuration() * (progressBar.value / 100);
        player.seekTo(seekTo);
    });

    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const icon = document.body.classList.contains('dark-mode') ? 'sunny-outline' : 'moon-outline';
        this.innerHTML = `<ion-icon name="${icon}"></ion-icon>`;
    });

    updatePlaylist();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        document.getElementById('play-pause').innerHTML = '<ion-icon name="pause-outline"></ion-icon>';
        updateProgressBar();
    } else {
        isPlaying = false;
        document.getElementById('play-pause').innerHTML = '<ion-icon name="play-outline"></ion-icon>';
    }

    if (event.data === YT.PlayerState.ENDED) {
        if (mode === 'repeat_one') {
            player.seekTo(0);
            player.playVideo();
        } else {
            player.nextVideo();
        }
    }

    const videoData = player.getVideoData();
    document.getElementById('title').textContent = videoData.title;
    document.getElementById('artist').textContent = videoData.author;
}

function updateProgressBar() {
    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();
    progressBar.value = (currentTime / duration) * 100;
    currentTimeDisplay.textContent = formatTime(currentTime);

    if (isPlaying) {
        requestAnimationFrame(updateProgressBar);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
