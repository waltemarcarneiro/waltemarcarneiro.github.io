let player;
let isPlaying = false;
let progressBar = document.getElementById('progress');

function onYouTubeIframeAPIReady() {
    player = new YT.Player('music-player', {
        height: '315',
        width: '100%',
        videoId: 'ckUV8X6MkaI',
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

function onPlayerReady(event) {
    document.getElementById('play-pause').addEventListener('click', function() {
        if (isPlaying) {
            player.pauseVideo();
            this.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            player.playVideo();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    document.getElementById('prev').addEventListener('click', function() {
        player.previousVideo();
    });

    document.getElementById('next').addEventListener('click', function() {
        player.nextVideo();
    });

    document.getElementById('stop').addEventListener('click', function() {
        player.stopVideo();
        document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    });

    document.getElementById('mute').addEventListener('click', function() {
        if (player.isMuted()) {
            player.unMute();
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            player.mute();
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });

    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Update progress bar
    setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (duration > 0) {
                progressBar.value = (currentTime / duration) * 100;
            }
        }
    }, 1000);

    progressBar.addEventListener('input', function() {
        const duration = player.getDuration();
        player.seekTo((progressBar.value / 100) * duration, true);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        document.getElementById('play-pause').innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    }
    updateTitleAndArtist();
}

function updateTitleAndArtist() {
    const videoData = player.getVideoData();
    document.getElementById('title').textContent = videoData.title;
    document.getElementById('artist').textContent = videoData.author;
}