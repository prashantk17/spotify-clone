document.addEventListener("DOMContentLoaded", () => {
  // --- Data for songs and albums ---
  const songs = [
    { title: "Song One", artist: "Artist A", url: "music/Lofi/song1.mp3" },
    { title: "Song Two", artist: "Artist B", url: "music/Lofi/song2.mp3" },
    { title: "Song Three", artist: "Artist C", url: "music/Rock/song1.mp3" },
  ];

  const albums = [
    {
      title: "Hot Hits",
      description: "The hottest tracks right now.",
      cover: "https://picsum.photos/200?1",
    },
    {
      title: "Chill Vibes",
      description: "Relax and unwind with these tunes.",
      cover: "https://picsum.photos/200?2",
    },
    {
      title: "Workout Mix",
      description: "Pump up your workout.",
      cover: "https://picsum.photos/200?3",
    },
  ];

  // --- Selectors for HTML elements ---
  const sidebar = document.querySelector(".sidebar");
  const hamburger = document.querySelector(".hamburger");
  const closeBtn = document.querySelector(".close");
  const playBtn = document.getElementById("play"); // this is now a Lucide <i>
  const previousBtn = document.getElementById("previous");
  const nextBtn = document.getElementById("next");
  const songListUl = document.querySelector(".songList ul");
  const cardContainer = document.querySelector(".cardContainer");
  const songInfoTitle = document.querySelector(".song-title");
  const songInfoArtist = document.querySelector(".song-artist");
  const songTime = document.querySelector(".songtime");
  const seekbar = document.querySelector(".seekbar");
  const seekbarCircle = document.querySelector(".circle");
  const volumeSlider = document.querySelector(".volume input");
  const volumeIcon = document.querySelector(".volume i");

  // --- Audio element for playback ---
  let currentSong = new Audio();
  let isPlaying = false;
  let currentSongIndex = 0;

  // --- Functions ---
  const loadSongs = () => {
    if (songListUl) {
      songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
                    <i data-lucide="music" class="invert"></i>
                    <div>
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                `;
        li.addEventListener("click", () => playSong(index));
        songListUl.appendChild(li);
      });
      lucide.createIcons();
    }
  };

  const loadAlbums = () => {
    if (cardContainer) {
      albums.forEach((album) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
                    <img src="${album.cover}" alt="Album Cover">
                    <div class="play-button"><i data-lucide="play" class="invert"></i></div>
                    <h2>${album.title}</h2>
                    <p>${album.description}</p>
                `;
        cardContainer.appendChild(card);
      });
      lucide.createIcons();
    }
  };

  const playSong = (index) => {
    if (currentSong) currentSong.pause();

    currentSongIndex = index;
    currentSong = new Audio(songs[currentSongIndex].url);
    currentSong.play();
    isPlaying = true;

    playBtn.setAttribute("data-lucide", "pause"); // change play → pause icon
    lucide.createIcons();

    songInfoTitle.textContent = songs[currentSongIndex].title;
    songInfoArtist.textContent = songs[currentSongIndex].artist;
  };

  const updatePlayPause = () => {
    if (isPlaying) {
      currentSong.pause();
      playBtn.setAttribute("data-lucide", "play");
    } else {
      currentSong.play();
      playBtn.setAttribute("data-lucide", "pause");
    }
    lucide.createIcons();
    isPlaying = !isPlaying;
  };

  const nextSong = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    playSong(currentSongIndex);
  };

  const previousSong = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(currentSongIndex);
  };

  // --- Event Listeners ---
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", () => sidebar.classList.add("active"));
  }
  if (closeBtn && sidebar) {
    closeBtn.addEventListener("click", () =>
      sidebar.classList.remove("active")
    );
  }
  if (playBtn) playBtn.addEventListener("click", updatePlayPause);
  if (nextBtn) nextBtn.addEventListener("click", nextSong);
  if (previousBtn) previousBtn.addEventListener("click", previousSong);

  if (seekbar) {
    seekbar.addEventListener("click", (e) => {
      const clickX = e.offsetX;
      const seekbarWidth = seekbar.clientWidth;
      const seekPercentage = clickX / seekbarWidth;
      currentSong.currentTime = currentSong.duration * seekPercentage;
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const value = parseFloat(e.target.value);
      currentSong.volume = value;
      // Change icon depending on volume
      if (value === 0) {
        volumeIcon.setAttribute("data-lucide", "volume-x");
      } else if (value < 0.5) {
        volumeIcon.setAttribute("data-lucide", "volume-1");
      } else {
        volumeIcon.setAttribute("data-lucide", "volume-2");
      }
      lucide.createIcons();
    });
  }

  //--- Volume sliders ---
  let lastVolume = 1; // remember last non-zero volume

  if (volumeIcon) {
    volumeIcon.addEventListener("click", () => {
      if (currentSong.volume > 0) {
        // Mute
        lastVolume = currentSong.volume;
        currentSong.volume = 0;
        if (volumeSlider) volumeSlider.value = 0;
        volumeIcon.setAttribute("data-lucide", "volume-x");
      } else {
        // Restore
        currentSong.volume = lastVolume;
        if (volumeSlider) volumeSlider.value = lastVolume;
        volumeIcon.setAttribute(
          "data-lucide",
          lastVolume < 0.5 ? "volume-1" : "volume-2"
        );
      }
      lucide.createIcons();
    });
  }

  // --- Audio events for updating UI ---
  currentSong.addEventListener("timeupdate", () => {
    const currentTime = currentSong.currentTime;
    const duration = currentSong.duration;
    const progressPercentage = (currentTime / duration) * 100;
    seekbarCircle.style.left = progressPercentage + "%";

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
        .toString()
        .padStart(2, "0")}`;
    };
    songTime.textContent = `${formatTime(currentTime)} / ${formatTime(
      duration
    )}`;
  });

  // --- Initial setup ---
  loadSongs();
  loadAlbums();
});
