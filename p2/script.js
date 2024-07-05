let player;
let isPlaying = false;
let isShuffle = false;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'ckUV8X6MkaI',
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'disablekb': 1,
            'iv_load_policy': 3,
            'modestbranding': 1,
            'rel': 0,
            'showinfo': 0
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

    document.getElementById('repeat-shuffle').addEventListener('click', function() {
        if (!isShuffle) {
            player.setShuffle(true);
            this.innerHTML = '<ion-icon name="shuffle-outline"></ion-icon>';
        } else {
            player.setShuffle(false);
            this.innerHTML = '<ion-icon name="repeat-outline"></ion-icon>';
        }
        isShuffle = !isShuffle;
    });

    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.innerHTML = document.body.classList.contains('dark-mode') ? '<ion-icon name="moon-outline"></ion-icon>' : '<ion-icon name="sunny-outline"></ion-icon>';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    document.getElementById('playlist-toggle').addEventListener('click', function() {
        document.getElementById('playlist-overlay').style.display = 'flex';
        loadPlaylist();
    });

    document.getElementById('close-playlist').addEventListener('click', function() {
        document.getElementById('playlist-overlay').style.display = 'none';
    });

    setInterval(() => {
        if (player && player.getCurrentTime) {
            const currentTime = player.getCurrentTime();
            const duration = player.getDuration();
            if (duration > 0) {
                progressBar.value = (currentTime / duration) * 100;
                currentTimeDisplay.textContent = formatTime(currentTime);
                durationDisplay.textContent = formatTime(duration);
            }
        }
    }, 1000);

    progressBar.addEventListener('input', function() {
        const duration = player.getDuration();
        player.seekTo((progressBar.value / 100) * duration, true);
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('theme-toggle').innerHTML = savedTheme === 'dark' ? '<ion-icon name="moon-outline"></ion-icon>' : '<ion-icon name="sunny-outline"></ion-icon>';
    }

    updateTitleAndArtist();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        document.getElementById('play-pause').innerHTML = '<ion-icon name="play-outline"></ion-icon>';
        isPlaying = false;
    }
    updateTitleAndArtist();
}

function updateTitleAndArtist() {
    const videoData = player.getVideoData();
    document.getElementById('title').textContent = videoData.title;
    document.getElementById('artist').textContent = videoData.author;
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function loadPlaylist() {
    const playlist = player.getPlaylist();
    const playlistContainer = document.getElementById('playlist-items');
    playlistContainer.innerHTML = '';

    playlist.forEach((videoId, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Vídeo ${index + 1}`;
        listItem.addEventListener('click', () => {
            player.playVideoAt(index);
            document.getElementById('playlist-overlay').style.display = 'none';
        });
        playlistContainer.appendChild(listItem);
    });
}