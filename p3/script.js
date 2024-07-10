let player;
let isPlaying = false;
let isShuffle = false;
let mode = 'repeat'; // 'repeat', 'repeat_one', 'shuffle'
let progressBar, currentTimeDisplay, durationDisplay;

document.addEventListener('DOMContentLoaded', function() {
    progressBar = document.getElementById('progress');
    currentTimeDisplay = document.getElementById('current-time');
    durationDisplay = document.getElementById('duration');
    
    // Verifique se todos os elementos DOM necessários estão presentes
    if (progressBar && currentTimeDisplay && durationDisplay) {
        onYouTubeIframeAPIReady();
    } else {
        console.error('Um ou mais elementos DOM não foram encontrados.');
    }
});

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

function onPlayerReady(event) {
    document.querySelector('.control-button:nth-child(3)').addEventListener('click', function() {
        if (isPlaying) {
            player.pauseVideo();
            this.innerHTML = '<ion-icon name="play-outline" class="play-outline"></ion-icon>';
        } else {
            player.playVideo();
            this.innerHTML = '<ion-icon name="pause-outline" class="pause-outline"></ion-icon>';
        }
        isPlaying = !isPlaying;
    });

    document.querySelector('.control-button:nth-child(2)').addEventListener('click', function() {
        player.previousVideo();
    });

    document.querySelector('.control-button:nth-child(4)').addEventListener('click', function() {
        player.nextVideo();
    });

    // Modo de repetição e shuffle
    document.querySelector('.control-button:nth-child(1)').addEventListener('click', function() {
        switch (mode) {
            case 'repeat':
                mode = 'repeat_one';
                this.innerHTML = '<ion-icon name="repeat-outline"></ion-icon><span class="repeat-number">1</span>';
                player.setLoop(true);
                break;
            case 'repeat_one':
                mode = 'shuffle';
                this.innerHTML = '<ion-icon name="shuffle-outline"></ion-icon>';
                player.setLoop(false);
                isShuffle = true;
                player.setShuffle(isShuffle);
                break;
            case 'shuffle':
                mode = 'repeat';
                this.innerHTML = '<ion-icon name="repeat-outline"></ion-icon>';
                isShuffle = false;
                player.setShuffle(isShuffle);
                break;
        }
    });

    document.querySelector('.control-button:nth-child(5)').addEventListener('click', function() {
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

    // TEMA CLARO E ESCURO
    const savedTheme = localStorage.getItem('theme');
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('theme-toggle').innerHTML = savedTheme === 'dark' ? '<ion-icon name="sunny-outline"></ion-icon>' : '<ion-icon name="moon-outline"></ion-icon>';
        metaThemeColor.setAttribute('content', savedTheme === 'dark' ? '#0F0F0F' : '#f0f4f9');
    }

    // THEME-COLOR CONFIG
    document.getElementById('theme-toggle').addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');

        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
            this.innerHTML = '<ion-icon name="moon-outline"></ion-icon>';
            metaThemeColor.setAttribute('content', '#f0f4f9');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            this.innerHTML = '<ion-icon name="sunny-outline"></ion-icon>';
            metaThemeColor.setAttribute('content', '#0F0F0F');
            localStorage.setItem('theme', 'dark');
        }
    });

    updateTitleAndArtist();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) {
        document.querySelector('.control-button:nth-child(3)').innerHTML = '<ion-icon name="play-outline"></ion-icon>';
        isPlaying = false;

        const playlist = player.getPlaylist();
        const currentIndex = player.getPlaylistIndex();

        switch (mode) {
            case 'repeat_one':
                player.seekTo(0);
                player.playVideo();
                break;
            case 'shuffle':
                player.setShuffle(true);
                player.nextVideo();
                break;
            case 'repeat':
                if (currentIndex === playlist.length - 1) {
                    player.playVideoAt(0);
                } else {
                    player.nextVideo();
                }
                break;
        }
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

async function loadPlaylist() {
    const playlist = player.getPlaylist();
    const playlistContainer = document.getElementById('playlist-items');
    playlistContainer.innerHTML = '';

    for (let index = 0; index < playlist.length; index++) {
        const videoId = playlist[index];
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyDSD1qRSM61xXXDk6CBHfbhnLfoXbQPsYY&part=snippet`);
            const data = await response.json();
            const video = data.items[0];
            const thumbnailUrl = video.snippet.thumbnails.default.url;
            const title = video.snippet.title;

            const listItem = document.createElement('li');

            const thumbnail = document.createElement('img');
            thumbnail.src = thumbnailUrl;
            listItem.appendChild(thumbnail);

            const titleText = document.createElement('span');
            titleText.textContent = title;
            listItem.appendChild(titleText);

            listItem.addEventListener('click', () => {
                player.playVideoAt(index);
                document.getElementById('playlist-overlay').style.display = 'none';
            });

            playlistContainer.appendChild(listItem);
        } catch (error) {
            console.error('Error fetching video details:', error);
        }
    }
}
