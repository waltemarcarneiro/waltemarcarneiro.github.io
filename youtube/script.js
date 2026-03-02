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
    const li = e.target.closest && e.target.closest('li');
    if (!li) return;
    const playlistId = li.dataset.playlistId;
    if (!playlistId) return;
    // Verificar se a playlist já existe no array
    const existingPlaylist = playlists.find(p => p.id === playlistId);
    if (existingPlaylist && existingPlaylist.songs && existingPlaylist.songs.length > 0) {
        loadPlaylist(existingPlaylist);
    } else {
        // para depuração, logamos
        console.info('Carregando playlist sugerida:', playlistId);
        fetchPlaylistData(playlistId);
    }
    sideMenu.classList.remove('active');
});

// auto-ocultar side-menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!sideMenu.classList.contains('active')) return;
    const inside = e.target.closest && e.target.closest('#side-menu');
    const clickedMenuBtn = e.target.closest && e.target.closest('#menu-btn');
    if (!inside && !clickedMenuBtn) {
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
        // Se repeat estiver ativo, reinicia a mesma faixa
        if (isRepeatActive && player && typeof player.seekTo === 'function' && typeof player.playVideo === 'function') {
            try {
                player.seekTo(0, true);
                player.playVideo();
            } catch (e) {
                // fallback: carregar novamente pela lista
                playNext();
            }
        } else {
            playNext(); // Avança para a próxima música automaticamente
        }
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
    const API_KEY = 'AIzaSyDSD1qRSM61xXXDk6CBHfbhnLfoXbQPsYY';
    const baseUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';

    // a API retorna no máximo 50 itens por chamada; precisamos paginar
    let allItems = [];
    let pageToken = '';

    do {
        const url = `${baseUrl}?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}` +
                    (pageToken ? `&pageToken=${pageToken}` : '');
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }
        const data = await response.json();
        allItems = allItems.concat(data.items || []);
        pageToken = data.nextPageToken || '';
    } while (pageToken);

    if (allItems.length === 0) {
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
        songs: allItems.map(item => ({
            id: item.snippet.resourceId.videoId,
            title: item.snippet.title,
            // Alterado para usar a miniatura de alta qualidade
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
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
    if (!currentPlaylist || currentPlaylist.songs.length === 0) return;

    // shuffle mode chooses a random different track
    if (isShuffleActive) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * currentPlaylist.songs.length);
        } while (newIndex === currentSongIndex && currentPlaylist.songs.length > 1);
        loadSong(newIndex);
        return;
    }

    // repeat mode simply reloads current track
    if (isRepeatActive) {
        loadSong(currentSongIndex);
        return;
    }

    if (currentSongIndex > 0) {
        loadSong(currentSongIndex - 1);
    }
}

function playNext() {
    if (!currentPlaylist || currentPlaylist.songs.length === 0) return;

    // shuffle mode chooses a random different track
    if (isShuffleActive) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * currentPlaylist.songs.length);
        } while (newIndex === currentSongIndex && currentPlaylist.songs.length > 1);
        loadSong(newIndex);
        return;
    }

    // repeat mode simply reloads current track
    if (isRepeatActive) {
        loadSong(currentSongIndex);
        return;
    }

    if (currentSongIndex < currentPlaylist.songs.length - 1) {
        loadSong(currentSongIndex + 1);
    }
}

// Adicione esta função auxiliar
function updatePlayButton() {
    const playBtn = document.getElementById('play-btn');
    playBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    // Atualiza também o botão do modal, se existir
    const modalPlay = document.getElementById('modal-play');
    if (modalPlay) {
        modalPlay.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    }
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

// Modal player: abrir/fechar e sincronizar informações
function openPlayerModal() {
    const modal = document.getElementById('player-modal');
    if (!modal) return;
    updateModalInfo();
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
}

function closePlayerModal() {
    const modal = document.getElementById('player-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
}

function updateModalInfo() {
    const songEl = document.getElementById('modal-song');
    const artistEl = document.getElementById('modal-artist');
    const thumb = document.getElementById('modal-thumbnail');
    if (!currentPlaylist || !currentPlaylist.songs[currentSongIndex]) {
        if (songEl) songEl.textContent = 'Nenhuma música selecionada';
        if (artistEl) artistEl.textContent = '-';
        if (thumb) thumb.src = 'placeholder.jpg';
        return;
    }
    const song = currentPlaylist.songs[currentSongIndex];
    if (songEl) songEl.textContent = song.title;
    if (artistEl) artistEl.textContent = song.artist;
    if (thumb) thumb.src = song.thumbnail || 'placeholder.jpg';
}

// vincular controles do modal
document.addEventListener('DOMContentLoaded', () => {
    const thumb = document.getElementById('current-thumbnail');
    if (thumb) thumb.addEventListener('click', openPlayerModal);

    const modalClose = document.getElementById('player-modal-close');
    if (modalClose) modalClose.addEventListener('click', closePlayerModal);

    const modalMin = document.getElementById('player-modal-minimize');
    if (modalMin) modalMin.addEventListener('click', closePlayerModal);

    const modalPrev = document.getElementById('modal-prev');
    if (modalPrev) modalPrev.addEventListener('click', playPrevious);
    const modalNext = document.getElementById('modal-next');
    if (modalNext) modalNext.addEventListener('click', playNext);
    const modalPlay = document.getElementById('modal-play');
    if (modalPlay) modalPlay.addEventListener('click', () => { togglePlay(); updateModalInfo(); });
});

// helper para formatar tempo mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// busca posição clicada na barra de progresso
function seekTo(e) {
    if (player && typeof player.seekTo === 'function' && typeof player.getDuration === 'function') {
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
