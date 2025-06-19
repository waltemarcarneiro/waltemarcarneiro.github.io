class RadioPlayer {
  constructor() {
    this.elements = {
      cover: document.getElementById('cover'),
      title: document.getElementById('title'),
      artist: document.getElementById('artist'),
      player: document.querySelector('.player'),
      noCover: document.querySelector('.no-cover')
    };
    
    this.state = {
      lastSongId: null,
      isLoading: false,
      retryCount: 0,
      maxRetries: 3
    };

    // Ajuste na URL da API e headers
    this.API_URL = 'https://www.antena1.com.br/api/v1/aovivo/getCurrentSongInfo/antena_1';
    this.headers = {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'mode': 'cors',
      'credentials': 'omit'
    };

    // Adiciona elementos de controle
    this.audioPlayer = document.getElementById('audio-player');
    this.playButton = document.getElementById('playButton');
    
    this.lyricsOriginal = '';
    this.lyricsTranslation = '';
    this.artistInfo = {};

    this.setupAudioControls();
    this.setupLyricsModalHandlers();
    this.setupArtistModalHandler();
  }

  setupAudioControls() {
    this.playButton.addEventListener('click', () => this.togglePlay());
    
    // Atualiza ícone quando o estado do áudio muda
    this.audioPlayer.addEventListener('play', () => {
      this.playButton.querySelector('.material-icons').textContent = 'pause';
    });
    
    this.audioPlayer.addEventListener('pause', () => {
      this.playButton.querySelector('.material-icons').textContent = 'play_arrow';
    });
  }

  togglePlay() {
    if (this.audioPlayer.paused) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
  }

  async fetchWithTimeout(url, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: this.headers,
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Requisição excedeu o tempo limite');
      }
      // Não tenta mais JSONP, apenas lança o erro para ser tratado no getCurrentSong
      throw error;
    }
  }

  setupLyricsModalHandlers() {
    // Letra original
    const lyricsOriginalBtn = document.getElementById('lyricsOriginalBtn');
    if (lyricsOriginalBtn) {
      lyricsOriginalBtn.addEventListener('click', () => {
        window.modalManager.open('lyrics-original.html').then(() => {
          const el = document.getElementById('lyrics-original-content');
          if (el) {
            el.innerHTML = this.lyricsOriginal || '<p>Letra não disponível.</p>';
          }
        });
      });
    }
    // Letra traduzida
    const lyricsTranslationBtn = document.getElementById('lyricsTranslationBtn');
    if (lyricsTranslationBtn) {
      lyricsTranslationBtn.addEventListener('click', () => {
        window.modalManager.open('lyrics-translation.html').then(() => {
          const el = document.getElementById('lyrics-translation-content');
          if (el) {
            el.innerHTML = this.lyricsTranslation || '<p>Tradução não disponível.</p>';
          }
        });
      });
    }
  }

  setupArtistModalHandler() {
    // Corrigido para selecionar o botão correto
    const artistBtn = document.querySelector('.icon-button[aria-label="Artista"]');
    if (artistBtn) {
      artistBtn.addEventListener('click', () => {
        window.modalManager.open('artist-info.html').then(() => {
          const el = document.getElementById('artist-modal-content');
          if (el) {
            el.innerHTML = `
              <h3>${this.artistInfo.name || 'Artista indisponível'}</h3>
              ${this.artistInfo.album ? `<p><strong>Álbum:</strong> ${this.artistInfo.album}</p>` : ''}
              ${this.artistInfo.year ? `<p><strong>Ano:</strong> ${this.artistInfo.year}</p>` : ''}
              ${this.artistInfo.bio ? `<div class="artist-bio">${this.artistInfo.bio}</div>` : '<p>Biografia não disponível.</p>'}
            `;
          }
        });
      });
    }
  }

  validateSongData(response) {
    try {
      console.log('Dados brutos recebidos:', response);
      
      // Verifica se temos os dados necessários
      if (!response?.data) {
        throw new Error('Dados inválidos da API');
      }

      const data = response.data;
      // Salva as letras para uso nos modais
      this.lyricsOriginal = data.lyrics || '';
      this.lyricsTranslation = data.lyricsTranslation || '';
      this.artistInfo = {
        name: data.artist || '',
        album: data.album || '',
        year: data.year || '',
        bio: data.artistShortBio || ''
      };
      
      return {
        id: Date.now(), // Usa timestamp como ID para forçar atualização
        title: data.song || 'Título indisponível',
        artist: data.artist || 'Artista indisponível',
        cover: data.cover || null,
        album: data.album || '',
        year: data.year || ''
      };
    } catch (error) {
      console.error('Erro ao validar dados:', error);
      return null;
    }
  }

  async updateUI(songData, animate = true) {
    if (!songData) return;

    try {
      // Atualiza texto primeiro
      this.elements.title.textContent = songData.title;
      this.elements.artist.textContent = songData.artist;

      // Tratamento específico para a capa
      if (songData.cover) {
        // Tenta carregar a imagem com proxy se necessário
        const tryLoadImage = async (url) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject();
            img.src = url;
          });
        };

        try {
          // Tenta carregar diretamente
          const directUrl = songData.cover;
          const proxyUrl = `https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&url=${encodeURIComponent(songData.cover)}`;
          
          let finalUrl;
          try {
            finalUrl = await tryLoadImage(directUrl);
          } catch {
            try {
              finalUrl = await tryLoadImage(proxyUrl);
            } catch {
              throw new Error('Falha ao carregar imagem');
            }
          }

          // Atualiza a imagem com fade
          this.elements.cover.style.opacity = '0';
          this.elements.noCover.style.display = 'none';
          this.elements.cover.style.display = 'block';
          
          // Força o reflow para garantir a transição
          void this.elements.cover.offsetWidth;
          
          this.elements.cover.src = finalUrl;
          this.elements.cover.style.opacity = '1';
          
          console.log('Capa atualizada com sucesso:', finalUrl);
        } catch (imgError) {
          console.error('Erro ao carregar capa:', imgError);
          this.elements.cover.style.display = 'none';
          this.elements.noCover.style.display = 'flex';
        }
      } else {
        this.elements.cover.style.display = 'none';
        this.elements.noCover.style.display = 'flex';
      }
    } catch (error) {
      console.error('Erro ao atualizar UI:', error);
    }
  }

  async getCurrentSong() {
    if (this.state.isLoading) return;
    
    try {
      this.state.isLoading = true;
      this.elements.player.classList.add('loading');

      const timestamp = Date.now();
      const url = `${this.API_URL}?FYC=${timestamp}`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

      let data;
      try {
        // Sempre usa o proxy para evitar CORS
        const proxyResponse = await fetch(proxyUrl);
        const proxyData = await proxyResponse.json();
        data = JSON.parse(proxyData.contents);
      } catch (proxyError) {
        console.warn('Não foi possível atualizar a música. Verifique sua conexão ou tente novamente mais tarde.');
        this.state.isLoading = false;
        this.elements.player.classList.remove('loading');
        return;
      }

      if (data?.status === 'success') {
        const songData = this.validateSongData(data);
        if (songData) {
          await this.updateUI(songData);
          this.state.retryCount = 0;
        }
      }

    } catch (error) {
      if (error.name !== 'TypeError') {
        console.error('Erro detalhado:', error);
      }
      this.state.retryCount++;
      if (this.state.retryCount <= this.state.maxRetries) {
        setTimeout(() => this.getCurrentSong(), 5000);
      }
    } finally {
      this.state.isLoading = false;
      this.elements.player.classList.remove('loading');
    }
  }

  start() {
    console.log('Iniciando RadioPlayer...');
    this.getCurrentSong();
    // Reduzindo o intervalo para 10 segundos para atualização mais frequente
    setInterval(() => this.getCurrentSong(), 10000);
  }
}

// Inicialização com tratamento de erros
document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('DOM carregado, iniciando player...');
    const player = new RadioPlayer();
    player.start();
  } catch (error) {
    console.error('Erro ao inicializar o player:', error);
  }
});