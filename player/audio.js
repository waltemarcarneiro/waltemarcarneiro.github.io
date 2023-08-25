//Evento Pause
document.addEventListener("play", function (evt) {
            if (this.$AudioPlaying && this.$AudioPlaying !== evt.target) {
                this.$AudioPlaying.pause();
            }
            this.$AudioPlaying = evt.target;
        }, true);


// Variável para armazenar o índice da música atual
let currentAudioIndex = 0;

// Lista de elementos de áudio na página
const audioElements = document.querySelectorAll('audio');

// Adicionar um evento 'ended' a cada elemento de áudio
audioElements.forEach((audio, index) => {
  audio.addEventListener('ended', () => {
    // Pausar o áudio atual
    audio.pause();

    // Avançar para o próximo áudio
    currentAudioIndex = (currentAudioIndex + 1) % audioElements.length;
    
    // Iniciar a reprodução do próximo áudio
    audioElements[currentAudioIndex].play();
  });
});
