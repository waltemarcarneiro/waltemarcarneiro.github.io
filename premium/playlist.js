document.getElementById('show-playlist').addEventListener('click', function() {
    document.getElementById('playlist-overlay').style.display = 'flex';
});

document.getElementById('close-playlist').addEventListener('click', function() {
    document.getElementById('playlist-overlay').style.display = 'none';
});

function updatePlaylist() {
    const playlist = player.getPlaylist();
    const playlistContainer = document.getElementById('playlist-items');
    playlistContainer.innerHTML = '';

    playlist.forEach((videoId, index) => {
        const listItem = document.createElement('li');

        const thumbnail = document.createElement('img');
        thumbnail.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
        listItem.appendChild(thumbnail);

        const titleText = document.createElement('span');
        titleText.className = 'video-title';
        titleText.textContent = player.getVideoData().title;
        listItem.appendChild(titleText);

        listItem.addEventListener('click', () => {
            player.playVideoAt(index);
            document.getElementById('playlist-overlay').style.display = 'none';
        });

        playlistContainer.appendChild(listItem);
    });
}
