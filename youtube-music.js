(function () {
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
const musicFeedback = document.getElementById('music-feedback');

if (!musicToggle) return;

let player = null;
let playerReady = false;
let isPlaying = false;

const videoId = '5u4xTa3LR2U';

const playSvg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg>';

const pauseSvg = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

function feedback(message) {
    if (!musicFeedback) return;
    musicFeedback.innerText = message;
    musicFeedback.classList.remove('hidden');
}

function updateButton(playing) {
    isPlaying = playing;

    if (musicIcon) musicIcon.innerHTML = playing ? pauseSvg : playSvg;
    if (musicText) musicText.innerText = playing ? 'Pause Music' : 'Play Music';
}

// Create YouTube player container if missing
let container = document.getElementById('youtube-player');

if (!container) {
    container = document.createElement('div');
    container.id = 'youtube-player';
    container.style.width = '200px';
    container.style.height = '200px';
    container.style.margin = '10px auto';

    musicToggle.parentNode.appendChild(container);
}

// Load YouTube API
function loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
        createPlayer();
        return;
    }

    if (!document.getElementById('youtube-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
    }

    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = function () {
        if (typeof previousCallback === 'function') {
            previousCallback();
        }
        createPlayer();
    };
}

function createPlayer() {
    if (player || !window.YT || !window.YT.Player) return;

    player = new YT.Player('youtube-player', {
        width: '200',
        height: '200',
        videoId: videoId,
        playerVars: {
            autoplay: 0,
            controls: 1,
            playsinline: 1,
            rel: 0
        },
        events: {
            onReady: function () {
                playerReady = true;
            },
            onStateChange: function (event) {
                if (event.data === YT.PlayerState.PLAYING) {
                    updateButton(true);
                } else if (
                    event.data === YT.PlayerState.PAUSED ||
                    event.data === YT.PlayerState.ENDED
                ) {
                    updateButton(false);
                }
            },
            onError: function () {
                updateButton(false);
                feedback('YouTube video cannot be played.');
            }
        }
    });
}

musicToggle.addEventListener('click', function (event) {
    event.preventDefault();

    if (!playerReady || !player) {
        feedback('Music is loading. Please try again.');
        loadYouTubeAPI();
        return;
    }

    if (isPlaying) {
        player.pauseVideo();
    } else {
        player.playVideo();
    }
});

loadYouTubeAPI();
})();