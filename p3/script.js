
        let player;
        let playlistData = [];

        function onYouTubeIframeAPIReady() {
            player = new YT.Player('music-player', {
                height: '450',
                width: '100%',
                playerVars: {
                    listType: 'playlist',
                    list: 'PLX_YaKXOr1s6u6O3srDxVJn720Zi2RRC5'
                },
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerReady(event) {
            document.getElementById('toggle-playlist').addEventListener('click', function() {
                document.getElementById('playlist-overlay').style.display = 'block';
                renderPlaylist();
            });

            document.getElementById('close-playlist').addEventListener('click', function() {
                document.getElementById('playlist-overlay').style.display = 'none';
            });

            // Preencher dados da playlist no início
            fetchPlaylistData();
        }

        function onPlayerStateChange(event) {
            if (event.data === YT.PlayerState.PLAYING) {
                updateCurrentVideoData();
            }
        }

        async function fetchPlaylistData() {
            const playlist = player.getPlaylist();
            playlistData = playlist.map(videoId => ({
                videoId,
                title: '',
                author: ''
            }));

            for (let i = 0; i < playlistData.length; i++) {
                const videoId = playlistData[i].videoId;
                try {
                    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                    const data = await response.json();
                    playlistData[i].title = data.title;
                    playlistData[i].author = data.author_name;
                } catch (error) {
                    console.error('Error fetching video details:', error);
                }
            }

            renderPlaylist();
        }

        function renderPlaylist() {
            const playlistContainer = document.getElementById('playlist-items');
            playlistContainer.innerHTML = '';

            playlistData.forEach((video, index) => {
                const listItem = document.createElement('li');

                const thumbnail = document.createElement('img');
                thumbnail.src = `https://img.youtube.com/vi/${video.videoId}/default.jpg`;
                listItem.appendChild(thumbnail);

                const titleText = document.createElement('span');
                titleText.textContent = `${video.title} - ${video.author}`;
                listItem.appendChild(titleText);

                listItem.addEventListener('click', () => {
                    player.playVideoAt(index);
                    document.getElementById('playlist-overlay').style.display = 'none';
                });

                playlistContainer.appendChild(listItem);
            });
        }

        function updateCurrentVideoData() {
            const currentIndex = player.getPlaylistIndex();
            const videoData = player.getVideoData();
            playlistData[currentIndex].title = videoData.title;
            playlistData[currentIndex].author = videoData.author;
        }