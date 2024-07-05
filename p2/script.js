let player;
let isPlaying = false;
let progressBar = document.getElementById('progress');
let volumeControl = document.getElementById('volume');
let commentList = document.getElementById('comment-list');
let equalizer;

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

    document.getElementById('add-playlist').addEventListener('click', function() {
        let playlistId = document.getElementById('playlist-input').value;
        player.loadPlaylist({
            list: playlistId,
            listType: 'playlist'
        });
    });

    document.getElementById('post-comment').addEventListener('click', function() {
        let comment = document.getElementById('comment').value;
        if (comment) {
            let commentElement = document.createElement('div');
            commentElement.textContent = comment;
            commentList.appendChild(commentElement);
            document.getElementById('comment').value = '';
        }
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

    volumeControl.addEventListener('input', function() {
        player.setVolume(volumeControl.value);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }

    initializeEqualizer();
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

function initializeEqualizer() {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let analyser = context.createAnalyser();
    analyser.fftSize = 256;

    let source = context.createMediaElementSource(player.getIframe());
    source.connect(analyser);
    analyser.connect(context.destination);

    let bufferLength = analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);

    equalizer = document.getElementById('equalizer');
    let canvas = document.createElement('canvas');
    canvas.width = equalizer.clientWidth;
    canvas.height = equalizer.clientHeight;
    equalizer.appendChild(canvas);
    let canvasContext = canvas.getContext('2d');

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasContext.fillStyle = '#f0f0f0';
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        let barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];

            canvasContext.fillStyle = '#007bff';
            canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

            x += barWidth + 1;
        }
    }

    draw();
}
