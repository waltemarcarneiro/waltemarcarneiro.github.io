function loadPlaylist() {
    const playlist = player.getPlaylist();
    const playlistContainer = document.getElementById('playlist-items');
    playlistContainer.innerHTML = '';

    playlist.forEach((videoId, index) => {
        // Fetch video details using YouTube Data API
        fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=AIzaSyDSD1qRSM61xXXDk6CBHfbhnLfoXbQPsYY&part=snippet`)
            .then(response => response.json())
            .then(data => {
                const video = data.items[0];
                const thumbnailUrl = video.snippet.thumbnails.default.url;
                const title = video.snippet.title;

                const listItem = document.createElement('li');

                const thumbnail = document.createElement('img');
                thumbnail.src = thumbnailUrl;
                listItem.appendChild(thumbnail);

                const titleText = document.createElement('span');
                titleText.textContent = title;
                listItem.appendChild(titleText);

                listItem.addEventListener('click', () => {
                    player.playVideoAt(index);
                    document.getElementById('playlist-overlay').style.display = 'none';
                });

                playlistContainer.appendChild(listItem);
            })
            .catch(error => console.error('Error fetching video details:', error));
    });
}
