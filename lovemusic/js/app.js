let player;
const playlistId = 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5';
const initialVideoId = 'xiN4EOqpvwc';
let playlistData = [];
let progressInterval;

// API do YouTube pronta
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-frame', {
    height: '100%',
    width: '100%',
    videoId: initialVideoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      disablekb: 1,
      listType: 'playlist',
      list: playlistId,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// Player pronto
function onPlayerReady(event) {
  event.target.playVideo();
  setupCustomControls();
  updateVideoInfo();
  enableSeekBar();
  setupPlaylistSearch();

  clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (player && player.getPlayerState() === YT.PlayerState.PLAYING) {
      updateProgressBar();
    }
  }, 500);
}

// Estado do player
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    player.nextVideo();
  }

  if (event.data === YT.PlayerState.PLAYING) {
    setTimeout(() => {
      updateVideoInfo();

      const data = player.getVideoData();
      const exists = playlistData.some(v => v.id === data.video_id);
      if (!exists) {
        playlistData.push({
          id: data.video_id,
          title: data.title,
          author: data.author,
        });
      }
    }, 500);
  }
}

// Atualiza título/artista
function updateVideoInfo() {
  const data = player.getVideoData();
  const titleEl = document.querySelector('.video-title');
  const artistEl = document.querySelector('.video-artist');

  if (titleEl) titleEl.textContent = data.title || 'Título';
  if (artistEl) artistEl.textContent = data.author || 'Artista';
}

// Barra de progresso
function updateProgressBar() {
  const duration = player.getDuration();
  const currentTime = player.getCurrentTime();
  const progressEl = document.querySelector('.progress');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');

  if (!duration || !progressEl) return;

  const percent = (currentTime / duration) * 100;
  progressEl.style.width = `${percent}%`;

  if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
  if (totalTimeEl) totalTimeEl.textContent = formatTime(duration);
}

// Formata tempo (min:seg)
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
}

// Clique na barra para pular
function enableSeekBar() {
  const barEl = document.querySelector('.bar');

  barEl?.addEventListener('click', (e) => {
    const rect = barEl.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const duration = player.getDuration();
    const newTime = percent * duration;

    player.seekTo(newTime, true);
  });
}

// Controles personalizados
function setupCustomControls() {
  const btnPlay = document.querySelector('img[src*="play.svg"]');
  const btnNext = document.querySelector('img[src*="next.svg"]');
  const btnPrev = document.querySelector('img[src*="prev.svg"]');
  const btnShuffle = document.querySelector('img[src*="shuffle.svg"]');
  const btnPlaylist = document.querySelector('img[src*="playlist.svg"]');
  const btnClose = document.getElementById('closePlaylist');

  btnPlay?.addEventListener('click', () => {
    const state = player.getPlayerState();
    state === YT.PlayerState.PLAYING ? player.pauseVideo() : player.playVideo();
  });

  btnNext?.addEventListener('click', () => {
    player.nextVideo();
  });

  btnPrev?.addEventListener('click', () => {
    player.previousVideo();
  });

  btnShuffle?.addEventListener('click', () => {
    const playlist = player.getPlaylist();
    const randomIndex = Math.floor(Math.random() * playlist.length);
    player.playVideoAt(randomIndex);
  });

  btnPlaylist?.addEventListener('click', () => {
    const modal = document.getElementById('modal-playlist');
    modal?.classList.remove('hidden');

    const playlistIds = player.getPlaylist();
    if (playlistData.length === 0 && playlistIds?.length) {
      playlistData = playlistIds.map((id, index) => ({
        id,
        title: `Faixa ${index + 1}`,
        author: 'Artista desconhecido',
      }));
    }

    renderPlaylist(playlistData);
  });

  btnClose?.addEventListener('click', () => {
    document.getElementById('modal-playlist')?.classList.add('hidden');
  });
}

// Renderiza a playlist
function renderPlaylist(items) {
  const container = document.getElementById('playlist-content');
  if (!container) return;

  container.innerHTML = '';

  items.forEach((video) => {
    const item = document.createElement('div');
    item.classList.add('playlist-item');
    item.textContent = `${video.title} – ${video.author}`;
    item.onclick = () => {
      const index = playlistData.findIndex(v => v.id === video.id);
      if (index !== -1) {
        player.playVideoAt(index);
        updateVideoInfo();
        document.getElementById('modal-playlist')?.classList.add('hidden');
      }
    };
    container.appendChild(item);
  });
}

// Filtro de busca da playlist (executa só 1 vez)
function setupPlaylistSearch() {
  const searchInput = document.getElementById('playlist-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const text = searchInput.value.trim().toLowerCase();
    const filtered = playlistData.filter(v =>
      (v.title || '').toLowerCase().includes(text) ||
      (v.author || '').toLowerCase().includes(text)
    );
    renderPlaylist(filtered);
  });
}
