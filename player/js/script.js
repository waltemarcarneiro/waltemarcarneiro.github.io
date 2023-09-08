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
      audioTag.innerText = "Playing";
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

updatePlaylistTime();
