let playlists = [
    {
        id: 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5',
        name: 'Playlist Padrão'
    }
];

// Carregar playlists do localStorage
function loadPlaylists() {
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
        playlists = JSON.parse(savedPlaylists);
    }
    displayPlaylists();
}

// Salvar playlists no localStorage
function savePlaylists() {
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

// Exibir playlists na interface
function displayPlaylists() {
    const playlistsGrid = document.getElementById('playlistsGrid');
    playlistsGrid.innerHTML = '';

    playlists.forEach(playlist => {
        const card = createPlaylistCard(playlist);
        playlistsGrid.appendChild(card);
    });
}

// Adicionar nova playlist
function addPlaylist(id, name) {
    playlists.push({ id, name });
    savePlaylists();
    displayPlaylists();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadPlaylists();

    const addPlaylistBtn = document.getElementById('addPlaylistBtn');
    const playlistModal = document.getElementById('playlistModal');
    const savePlaylistBtn = document.getElementById('savePlaylist');
    const closeModalBtn = document.getElementById('closeModal');
    const playlistsLink = document.querySelector('a[href="#playlists"]');

    addPlaylistBtn.addEventListener('click', () => {
        playlistModal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', () => {
        playlistModal.style.display = 'none';
    });

    savePlaylistBtn.addEventListener('click', () => {
        const id = document.getElementById('playlistId').value;
        const name = document.getElementById('playlistName').value;
        
        if (id && name) {
            addPlaylist(id, name);
            playlistModal.style.display = 'none';
            document.getElementById('playlistId').value = '';
            document.getElementById('playlistName').value = '';
        }
    });

    playlistsLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('youtube-container').style.display = 'none';
        document.getElementById('playlists-container').style.display = 'block';
    });
}); 

function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.innerHTML = `
        <img src="https://img.youtube.com/vi/${getFirstVideoId(playlist.id)}/mqdefault.jpg" alt="${playlist.name}">
        <h3>${playlist.name}</h3>
        <button class="play-playlist-btn" data-playlist-id="${playlist.id}">
            <span class="material-icons">play_arrow</span>
            Reproduzir
        </button>
    `;

    // Corrigindo o evento de clique do botão
    const playButton = card.querySelector('.play-playlist-btn');
    playButton.addEventListener('click', () => {
        document.getElementById('youtube-container').style.display = 'block';
        document.getElementById('playlists-container').style.display = 'none';
        loadYouTubePlaylist(playlist.id);
    });

    return card;
}

// Adicionar esta nova função para obter o ID do primeiro vídeo
function getFirstVideoId(playlistId) {
    // Retorna um ID de vídeo padrão caso não consiga obter o primeiro vídeo
    return 'default-video-id';
}

class PlaylistManager {
  constructor() {
    this.playlist = [];
    this.currentIndex = 0;
    this.container = document.querySelector('.playlist-container');
  }

  loadPlaylist(songs) {
    this.playlist = songs;
    this.renderPlaylist();
  }

  renderPlaylist() {
    this.container.innerHTML = '';
    
    this.playlist.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${index === this.currentIndex ? 'playing' : ''}`;
      
      item.innerHTML = `
        <span class="playlist-item-title">${song.title}</span>
      `;
      
      item.addEventListener('click', () => this.playSong(index));
      this.container.appendChild(item);
    });
  }

  playSong(index) {
    this.currentIndex = index;
    const song = this.playlist[index];
    // Emite evento para o player tocar a música
    document.dispatchEvent(new CustomEvent('play-song', { detail: song }));
    this.renderPlaylist();
  }

  nextSong() {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    this.playSong(this.currentIndex);
  }

  previousSong() {
    this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
    this.playSong(this.currentIndex);
  }

  togglePlaylist() {
    this.container.classList.toggle('active');
  }
}

// Inicialização
const playlistManager = new PlaylistManager();

// Exemplo de uso
const samplePlaylist = [
  { title: 'Música 1', url: 'path/to/song1.mp3' },
  { title: 'Música 2', url: 'path/to/song2.mp3' },
  // Adicione mais músicas conforme necessário
];

playlistManager.loadPlaylist(samplePlaylist);