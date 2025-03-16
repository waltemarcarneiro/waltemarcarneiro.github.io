// Variáveis globais
let playlists = [];
let currentPlaylist = null;
let currentSongIndex = 0;
let isPlaying = false;
let player = null;
let isShuffleActive = false;
let isRepeatActive = false;
let progressInterval;

// Elementos do DOM
const menuBtn = document.getElementById('menu-btn');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const searchBtn = document.getElementById('search-btn');
const searchOverlay = document.getElementById('search-overlay');
const closeSearch = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const suggestedPlaylists = document.getElementById('suggested-playlists');
const progressBar = document.querySelector('.progress-line');
const progress = document.querySelector('.progress');
const currentTimeElement = document.querySelector('.current-time');
const durationElement = document.querySelector('.duration');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');

// Controle do menu
menuBtn.addEventListener('click', () => {
    sideMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    sideMenu.classList.remove('active');
});

// Controle da busca
searchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    searchInput.focus();
});

closeSearch.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
});

// Função de busca
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const songs = document.querySelectorAll('.song-item');
    
    songs.forEach(song => {
        const title = song.querySelector('.song-title').textContent.toLowerCase();
        const artist = song.querySelector('.song-artist').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            song.style.display = 'flex';
        } else {
            song.style.display = 'none';
        }
    });
});

// Manipulação das playlists sugeridas
suggestedPlaylists.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI') {
        const playlistId = e.target.dataset.playlistId;
        // Verificar se a playlist já existe no array
        const existingPlaylist = playlists.find(p => p.id === playlistId);
        if (existingPlaylist) {
            loadPlaylist(existingPlaylist);
        } else {
            fetchPlaylistData(playlistId);
        }
        sideMenu.classList.remove('active');
    }
});

// Adicione esta função que será chamada automaticamente quando a API do YouTube carregar
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// Adicionar esta nova função
function onPlayerReady(event) {
    updateProgressBar(); // Atualiza inicialmente
}
//Verifica o estado YT.PlayerState.ENDED e avança para a próxima música
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        startProgressInterval();
    } else if (event.data === YT.PlayerState.PAUSED) {
        clearInterval(progressInterval);
    } else if (event.data === YT.PlayerState.ENDED) {
        clearInterval(progressInterval);
        playNext(); // Avança para a próxima música automaticamente
    }
}


//ouvinte de evento para que o clique na barra de progresso funcione corretamente
progressBar.addEventListener('click', seekTo);

// Adicionar esta nova função
function startProgressInterval() {
    clearInterval(progressInterval); // Limpar intervalo existente
    progressInterval = setInterval(updateProgressBar, 500); // Atualizar a cada 500ms
}

// Função para adicionar playlist
function addPlaylist() {
    const playlistUrl = document.getElementById('playlist-url').value;
    if (!playlistUrl) return;

    // Extrair o ID da playlist do URL do YouTube
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
        alert('URL da playlist inválida');
        return;
    }

    // Fazer requisição para a API do YouTube (você precisará de uma chave de API)
    fetchPlaylistData(playlistId);
}

// Função para extrair ID da playlist
function extractPlaylistId(url) {
    const regex = /[?&]list=([^#\&\?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Função para buscar dados da playlist
async function fetchPlaylistData(playlistId) {
    const API_KEY = 'AIzaSyDSD1qRSM61xXXDk6CBHfbhnLfoXbQPsYY'; // Você precisa substituir por uma chave API válida
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }
        
        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            throw new Error('Playlist vazia ou não encontrada');
        }

        // Buscar informações adicionais da playlist
        const playlistInfoUrl = `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`;
        const playlistResponse = await fetch(playlistInfoUrl);
        const playlistData = await playlistResponse.json();
        
        const playlistTitle = playlistData.items?.[0]?.snippet?.title || 'Nova Playlist';

        const playlist = {
            id: playlistId,
            name: playlistTitle,
            songs: data.items.map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                // Alterado para usar a miniatura de alta qualidade
                thumbnail: item.snippet.thumbnails.high.url || item.snippet.thumbnails.default.url,
                artist: item.snippet.videoOwnerChannelTitle || 'Artista Desconhecido'
            }))
        };

        playlists.push(playlist);
        // Salvar no LocalStorage
        localStorage.setItem('playlists', JSON.stringify(playlists));
        updatePlaylistDisplay();
        loadPlaylist(playlist);
        
        // Feedback visual para o usuário
        document.getElementById('playlist-url').value = '';
        alert('Playlist carregada com sucesso!');
        
    } catch (error) {
        console.error('Erro ao carregar playlist:', error);
        alert('Erro ao carregar playlist: ' + error.message);
    }
}

// Função para atualizar display das playlists
function updatePlaylistDisplay() {
    const playlistList = document.getElementById('playlist-list');
    playlistList.innerHTML = playlists.map(playlist => `
        <div class="playlist-item" onclick="loadPlaylist('${playlist.id}')">
            <i class="fas fa-music"></i> ${playlist.name}
        </div>
    `).join('');
}

// Função para carregar playlist
function loadPlaylist(playlistIdOrObject) {
    let playlist;
    if (typeof playlistIdOrObject === 'string') {
        // Se for um ID, procurar a playlist correspondente
        playlist = playlists.find(p => p.id === playlistIdOrObject);
        if (!playlist) {
            // Se não encontrar nas playlists salvas, carregar da API
            fetchPlaylistData(playlistIdOrObject);
            return;
        }
    } else {
        // Se for um objeto, usar diretamente
        playlist = playlistIdOrObject;
    }

    currentPlaylist = playlist;
    currentSongIndex = 0;
    displaySongs();
    loadSong(currentSongIndex);
}

// Função para exibir músicas
function displaySongs() {
    if (!currentPlaylist) return;

    const songsContainer = document.getElementById('songs-container');
    songsContainer.innerHTML = currentPlaylist.songs.map((song, index) => `
        <div class="song-item ${currentSongIndex === index ? 'active' : ''}" onclick="loadSong(${index})">
            <img src="${song.thumbnail}" alt="${song.title}">
            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
        </div>
    `).join('');
}

// Função para carregar música
function loadSong(index) {
    if (!currentPlaylist || !currentPlaylist.songs[index]) return;

    currentSongIndex = index;
    const song = currentPlaylist.songs[index];
    
    document.getElementById('current-thumbnail').src = song.thumbnail;
    document.getElementById('current-song').textContent = song.title;
    document.getElementById('current-artist').textContent = song.artist;

    // Carrega e reproduz o vídeo usando o player do YouTube
    if (player && player.loadVideoById) {
        player.loadVideoById(song.id);
        isPlaying = true;
        updatePlayButton();
    }
}

// Controles do player
document.getElementById('play-btn').addEventListener('click', togglePlay);
document.getElementById('prev-btn').addEventListener('click', playPrevious);
document.getElementById('next-btn').addEventListener('click', playNext);

function togglePlay() {
    if (!player) return;

    isPlaying = !isPlaying;
    if (isPlaying) {
        player.playVideo();
    } else {
        player.pauseVideo();
    }
    updatePlayButton();
}

function playPrevious() {
    if (currentSongIndex > 0) {
        loadSong(currentSongIndex - 1);
    }
}

function playNext() {
    if (currentPlaylist && currentSongIndex < currentPlaylist.songs.length - 1) {
        loadSong(currentSongIndex + 1);
    }
}

// Adicione esta função auxiliar
function updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
}

// Carregar playlists do LocalStorage quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
        playlists = JSON.parse(savedPlaylists);
        updatePlaylistDisplay();
    }
});

// Adicione os event listeners para os novos botões
shuffleBtn.addEventListener('click', toggleShuffle);
repeatBtn.addEventListener('click', toggleRepeat);
progressBar.addEventListener('click', seekTo);

function toggleShuffle() {
    isShuffleActive = !isShuffleActive;
    shuffleBtn.classList.toggle('active');
}

function toggleRepeat() {
    isRepeatActive = !isRepeatActive;
    repeatBtn.classList.toggle('active');
}

function updateProgressBar() {
    if (!player || typeof player.getCurrentTime !== 'function' || typeof player.getDuration !== 'function') return;

    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();

    if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }

    currentTimeElement.textContent = formatTime(currentTime);
    durationElement.textContent = formatTime(duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function seekTo(event) {
    if (!player || typeof player.seekTo !== 'function' || typeof player.getDuration !== 'function') return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const duration = player.getDuration();

    const newTime = (clickX / width) * duration;
    player.seekTo(newTime, true);
}


function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function seekTo(e) {
    if (player && player.getDuration) {
        const rect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const progressWidth = rect.width;
        const seekTime = (clickPosition / progressWidth) * player.getDuration();
        player.seekTo(seekTime, true);
    }
}

function playRandomSong() {
    if (currentPlaylist && currentPlaylist.length > 0) {
        const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        playSong(currentPlaylist[randomIndex]);
    }
}
