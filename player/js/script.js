const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

let musicIndex = Math.floor(Math.random() * allMusic.length);
isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  createMusicList();
  playingSong();
  updatePlaylistTime();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb].name;
  musicArtist.innerText = allMusic[indexNumb].artist;
  musicImg.src = allMusic[indexNumb].img;
  mainAudio.src = allMusic[indexNumb].src;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 0 ? (musicIndex = allMusic.length - 1) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

function nextMusic() {
  musicIndex++;
  musicIndex >= allMusic.length ? (musicIndex = 0) : musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});

prevBtn.addEventListener("click", () => {
  prevMusic();
});

nextBtn.addEventListener("click", () => {
  nextMusic();
});

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
    musicDuration = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    musicDuration.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

function createMusicList() {
  const ulTag = wrapper.querySelector("ul");
  ulTag.innerHTML = "";
  for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                  <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <span id="${allMusic[i].src}" class="audio-duration">0:00</span>
                  <audio class="${allMusic[i].src}" src="${allMusic[i].src}"></audio>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);
  }
}

function playingSong() {
  const allLiTags = musicList.querySelectorAll("li");
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector(".audio-duration");
    if (allLiTags[j].classList.contains("playing")) {
      allLiTags[j].classList.remove("playing");
      audioTag.innerText = audioTag.getAttribute("t-duration");
    }
    if (allLiTags[j].getAttribute("li-index") == musicIndex + 1) {
      allLiTags[j].classList.add("playing");
      audioTag.innerText = "Tocando";
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex - 1;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}

function updatePlaylistTime() {
  const liTags = musicList.querySelectorAll("li");
  liTags.forEach((li, index) => {
    const audioTag = li.querySelector("audio");
    const durationTag = li.querySelector(".audio-duration");

    audioTag.addEventListener("loadeddata", () => {
      const duration = audioTag.duration;
      const totalMin = Math.floor(duration / 60);
      const totalSec = Math.floor(duration % 60);
      durationTag.innerText = `${totalMin}:${totalSec < 10 ? "0" : ""}${totalSec}`;
      durationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });
  });
}

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

//funcao botao looped

const repeatBtn = wrapper.querySelector("#repeat-plist");

repeatBtn.addEventListener("click", () => {
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      mainAudio.loop = true;
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      mainAudio.loop = false;
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

//função da timeline

// Atualize a função progressArea para ouvir o evento "click"
progressArea.addEventListener("click", (e) => {
  const progressWidth = progressArea.clientWidth; // Obtém a largura da barra de progresso
  const clickedOffsetX = e.offsetX; // Obtém o valor do deslocamento X do clique
  const songDuration = mainAudio.duration; // Obtém a duração total da música
  
  // Calcula o tempo da música com base na posição clicada
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
});

//evento ended
mainAudio.addEventListener("ended", () => {
  nextMusic();
});

updatePlaylistTime();

//SHARE AND BACKBUTTON CONFIG

document.getElementById('backButton').addEventListener('click', () => {
// Volta para a página anterior
history.back();
});
// Adicione o evento de clique ao ícone de compartilhamento
document.getElementById('shareButton').addEventListener('click', () => {
// Compartilha a página atual
if (navigator.share) {
       navigator.share({
       title: document.title,
       text: 'Playlist com as mais belas músicas românticas internacionais.',
       url: 'https://bit.ly/lovesongsplayer'
       }).then(() => {
       console.log('Página compartilhada com sucesso!');
       }).catch((error) => {
    console.error('Erro ao compartilhar a página:', error);
});

} else {
      console.log('Compartilhamento não suportado pelo navegador.');
// Aqui você pode adicionar um fallback ou mensagem para navegadores que não suportam o compartilhamento nativo.
       }
});

//controle do volume

const volumeSlider = document.getElementById('volumeSlider');
const volumeMuteButton = document.getElementById('volumeMuteButton');
let hideTimeout;

volumeSlider.addEventListener('input', function () {
  const volumeValue = parseFloat(volumeSlider.value);
  mainAudio.volume = volumeValue;
  updateVolumeIcon(volumeValue);
  clearTimeout(hideTimeout); // Cancela o temporizador durante a interação
  startHideTimer(); // Reinicia o temporizador durante a interação
});

volumeMuteButton.addEventListener('click', function () {
  toggleVolumeSlider();
  clearTimeout(hideTimeout); // Cancela o temporizador durante a interação
  startHideTimer(); // Reinicia o temporizador durante a interação
});

// Adiciona eventos de toque para dispositivos móveis
volumeSlider.addEventListener('touchstart', function () {
  clearTimeout(hideTimeout);
  startHideTimer(); // Reinicia o temporizador durante a interação
});

volumeSlider.addEventListener('touchend', function () {
  startHideTimer();
});

function toggleVolumeSlider() {
  const isVolumeSliderVisible = volumeSlider.style.display !== 'none';

  if (isVolumeSliderVisible) {
    volumeSlider.style.display = 'none'; // Oculta a barra de volume
  } else {
    volumeSlider.style.display = 'block'; // Mostra a barra de volume
  }
}

function startHideTimer() {
  clearTimeout(hideTimeout); // Limpa o temporizador atual

  // Inicia um novo temporizador para ocultar a barra após 3 segundos
  hideTimeout = setTimeout(hideVolumeSlider, 3000);
}

function hideVolumeSlider() {
  volumeSlider.style.display = 'none'; // Oculta a barra de volume após 3 segundos
}

// Adiciona um evento para cancelar o temporizador se o usuário estiver manipulando a barra no celular
volumeSlider.addEventListener('touchmove', function () {
  clearTimeout(hideTimeout);
});
