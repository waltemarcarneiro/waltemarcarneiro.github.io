let player;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let progressBar = document.getElementById('progress');
let currentTimeDisplay = document.getElementById('current-time');
let durationDisplay = document.getElementById('duration');

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

    document.getElementById('repeat-shuffle').addEventListener('click', function() {
        if (isRepeat) {
            isRepeat = false;
            isShuffle = true;
            player.setShuffle(true);
            this.innerHTML = '<i class="fas fa-random"></i>';
        } else if (isShuffle) {
            isRepeat = false;
            isShuffle = false;
            player.setShuffle(false);
            this.innerHTML = '<i class="fas fa-redo"></i>';
        } else {
            isRepeat = true;
            isShuffle = false;
            player.setShuffle(false);
            this.innerHTML = '<i class="fas fa-redo-alt"></i>';
        }
    });

//THEME (ALTERA O CORPO DO TEMA)
    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // THE (ALTERA O THEME-COLOR DO HEAD)
document.getElementById('theme-toggle').addEventListener('click', function() {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        this.textContent = 'Modo Escuro';
        metaThemeColor.setAttribute('content', '#ffffff');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        this.textContent = 'Modo Claro';
        metaThemeColor.setAttribute('content', '#0F0F0F');
    }
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
        document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }

    updateTitleAndArtist();
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
///////////////////////////

let player;
let audioCtx;
let source;
let audio;

// Inicializar o player do YouTube
function onYouTubeIframeAPIReady() {
    player = new YT.Player('music-player', {
        height: '0', // Ocultar o iframe visualmente
        width: '0', // Ocultar o iframe visualmente
        videoId: 'ckUV8X6MkaI', // ID do vídeo inicial
        playerVars: {
            'listType': 'playlist',
            'list': 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5', // Lista de reprodução
            'autoplay': 0,
            'controls': 0,
        },
        events: {
            'onReady': onPlayerReady, // Chama a função onPlayerReady quando o player está pronto
            'onStateChange': onPlayerStateChange // Chama a função onPlayerStateChange quando o estado do player muda
        }
    });
}

// Quando o player estiver pronto
function onPlayerReady(event) {
    // Criar um novo contexto de áudio
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Criar um elemento de áudio
    audio = new Audio();
    audio.crossOrigin = "anonymous"; // Permitir a extração de áudio
    audio.src = event.target.getIframe().src;

    // Criar uma fonte de áudio do elemento de áudio
    source = audioCtx.createMediaElementSource(audio);

    // Conectar a fonte ao destino (alto-falantes)
    source.connect(audioCtx.destination);

    // Adicionar eventos aos botões de controle
    document.getElementById('play-pause').addEventListener('click', function() {
        if (audio.paused) {
            audio.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    document.getElementById('prev').addEventListener('click', function() {
        player.previousVideo();
        updateAudioSrc();
    });

    document.getElementById('next').addEventListener('click', function() {
        player.nextVideo();
        updateAudioSrc();
    });

    document.getElementById('repeat-shuffle').addEventListener('click', function() {
        // Implementar lógica de repetição e shuffle
    });

    document.getElementById('theme-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        this.textContent = document.body.classList.contains('dark-mode') ? 'Modo Claro' : 'Modo Escuro';
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');

        // Alterar a meta tag theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (document.body.classList.contains('dark-mode')) {
            metaThemeColor.setAttribute('content', '#1e1e1e');
        } else {
            metaThemeColor.setAttribute('content', '#ffffff');
        }
    });

    // Verificar o tema salvo e aplicar
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-mode', savedTheme === 'dark');
        document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro';

        // Alterar a meta tag theme-color
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (savedTheme === 'dark') {
            metaThemeColor.setAttribute('content', '#1e1e1e');
        } else {
            metaThemeColor.setAttribute('content', '#ffffff');
        }
    }

    updateTitleAndArtist();
}

// Atualizar o título e o artista
function updateTitleAndArtist() {
    const videoData = player.getVideoData();
    document.getElementById('title').textContent = videoData.title;
    document.getElementById('artist').textContent = videoData.author;
}

// Atualizar a fonte de áudio quando o vídeo mudar
function updateAudioSrc() {
    audio.src = player.getIframe().src;
}

// Inicializar a API do YouTube
if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Manipular a mudança de estado do player
function onPlayerStateChange(event) {
    // Lógica adicional pode ser adicionada aqui se necessário
}
