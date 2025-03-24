document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const playIcon = "play";
    const pauseIcon = "pause";

    playPauseBtn.addEventListener("click", function () {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = `<ion-icon name="${pauseIcon}"></ion-icon>`;
        } else {
            audio.pause();
            playPauseBtn.innerHTML = `<ion-icon name="${playIcon}"></ion-icon>`;
        }
    });
});
