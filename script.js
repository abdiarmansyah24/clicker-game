/**
 * ===================================================================
 * CLICKER GAME - JAVASCRIPT LOGIC
 * Mengatur transisi layar (Halaman Utama, Countdown, Gameplay, Result)
 * ===================================================================
 */

// -------------------------------------------------------------------
// 1. STATE MANAGEMENT
// -------------------------------------------------------------------
let selectedDuration = 10;   // Default 10 Detik
let currentClicks = 0;        // Total klik sesi berjalan
let timeRemaining = 10;       // Sisa waktu berjalan
let timerInterval = null;     // Referensi interval timer
let isGameRunning = false;
let isCountingDown = false;
let startTime = 0;

// Status Suara (Mute/Unmute)
let isSoundMuted = localStorage.getItem('clicker_sound_muted') === 'true';

// High Scores per Durasi
let highScores = {
    '10': parseInt(localStorage.getItem('clicker_hs_10')) || 0,
    '15': parseInt(localStorage.getItem('clicker_hs_15')) || 0,
    '30': parseInt(localStorage.getItem('clicker_hs_30')) || 0
};

// -------------------------------------------------------------------
// 2. DOM ELEMENTS SELECTION
// -------------------------------------------------------------------
const viewMainMenu = document.getElementById('viewMainMenu');
const viewCountdown = document.getElementById('viewCountdown');
const viewGameplay = document.getElementById('viewGameplay');
const viewResult = document.getElementById('viewResult');

const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');
const trophyBtn = document.getElementById('trophyBtn');

const durationCards = document.querySelectorAll('.dur-card');
const startBtn = document.getElementById('startBtn');

const countdownNumber = document.getElementById('countdownNumber');

const gameplayTimer = document.getElementById('gameplayTimer');
const gameplayClicks = document.getElementById('gameplayClicks');
const clickMeBtn = document.getElementById('clickMeBtn');

const resTotalClicks = document.getElementById('resTotalClicks');
const resCps = document.getElementById('resCps');
const resDuration = document.getElementById('resDuration');
const hsBadgeTitle = document.getElementById('hsBadgeTitle');
const hsCardValue = document.getElementById('hsCardValue');
const resultHeadingTitle = document.getElementById('resultHeadingTitle');
const resultHeadingSub = document.getElementById('resultHeadingSub');
const playAgainBtn = document.getElementById('playAgainBtn');
const resetHsBtn = document.getElementById('resetHsBtn');
const confettiContainer = document.getElementById('confettiContainer');

const clickAudioFallback = document.getElementById('clickAudioFallback');

// -------------------------------------------------------------------
// 3. AUDIO SYNTHESIZER (Web Audio API)
// -------------------------------------------------------------------
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playClickSound() {
    if (isSoundMuted) return;

    try {
        const ctx = getAudioContext();
        if (ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.04);

            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.04);
            return;
        }
    } catch (e) {}

    if (clickAudioFallback) {
        clickAudioFallback.currentTime = 0;
        clickAudioFallback.play().catch(() => {});
    }
}

function playBeepSound(isFinal = false) {
    if (isSoundMuted) return;
    try {
        const ctx = getAudioContext();
        if (ctx) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(isFinal ? 880 : 440, ctx.currentTime);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (isFinal ? 0.25 : 0.12));

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + (isFinal ? 0.25 : 0.12));
        }
    } catch (e) {}
}

// -------------------------------------------------------------------
// 4. NAVIGATION & SCREEN SWITCHING
// -------------------------------------------------------------------
function showScreen(screenToShow) {
    viewMainMenu.classList.add('hidden');
    viewCountdown.classList.add('hidden');
    viewGameplay.classList.add('hidden');
    viewResult.classList.add('hidden');

    screenToShow.classList.remove('hidden');
}

// -------------------------------------------------------------------
// 5. INITIALIZATION
// -------------------------------------------------------------------
function initGame() {
    updateSoundUI();

    durationCards.forEach(card => {
        card.addEventListener('click', () => {
            if (isGameRunning || isCountingDown) return;

            durationCards.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('active');
            card.setAttribute('aria-checked', 'true');

            selectedDuration = parseInt(card.dataset.duration);
        });
    });

    startBtn.addEventListener('click', startCountdownSequence);
    clickMeBtn.addEventListener('pointerdown', handleUserClick);

    soundToggleBtn.addEventListener('click', toggleSound);
    trophyBtn.addEventListener('click', openHighScoreModal);
    
    closeHsModalBtn.addEventListener('click', closeHighScoreModal);
    modalResetHsBtn.addEventListener('click', resetHighScores);

    // Tutup modal jika klik background blur
    highScoreModal.addEventListener('click', (e) => {
        if (e.target === highScoreModal) {
            closeHighScoreModal();
        }
    });
    
    // Event Listener Logo untuk kembali ke Halaman Utama kapan saja
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        brandLogo.style.cursor = 'pointer';
        brandLogo.addEventListener('click', () => {
            if (!isGameRunning && !isCountingDown) {
                showScreen(viewMainMenu);
            }
        });
    }

    playAgainBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isGameRunning = false;
        isCountingDown = false;
        showScreen(viewMainMenu);
    });

    resetHsBtn.addEventListener('click', resetHighScores);

    showScreen(viewMainMenu);
}

// -------------------------------------------------------------------
// 6. GAME LOGIC
// -------------------------------------------------------------------

function startCountdownSequence() {
    if (isGameRunning || isCountingDown) return;

    isCountingDown = true;
    showScreen(viewCountdown);

    let count = 3;
    countdownNumber.textContent = count;
    playBeepSound(false);

    const countInterval = setInterval(() => {
        count--;
        if (count > 0) {
            countdownNumber.textContent = count;
            playBeepSound(false);
        } else if (count === 0) {
            countdownNumber.textContent = "GO!";
            playBeepSound(true);
        } else {
            clearInterval(countInterval);
            isCountingDown = false;
            startGameplay();
        }
    }, 800);
}

function startGameplay() {
    isGameRunning = true;
    currentClicks = 0;
    
    gameplayClicks.textContent = '0';
    gameplayTimer.textContent = `${selectedDuration}s`;
    
    showScreen(viewGameplay);

    startTime = performance.now();
    const durationMs = selectedDuration * 1000;

    timerInterval = setInterval(() => {
        const elapsedMs = performance.now() - startTime;
        const remainingMs = Math.max(0, durationMs - elapsedMs);

        timeRemaining = Math.ceil(remainingMs / 1000);
        gameplayTimer.textContent = `${timeRemaining}s`;

        if (remainingMs <= 0) {
            finishGame();
        }
    }, 50);
}

function handleUserClick(e) {
    if (!isGameRunning) return;
    e.preventDefault();

    currentClicks++;
    gameplayClicks.textContent = currentClicks;

    playClickSound();

    clickMeBtn.classList.add('clicked');
    setTimeout(() => clickMeBtn.classList.remove('clicked'), 80);

    createFloatingText(e);
}

function createFloatingText(e) {
    const floatEl = document.createElement('span');
    floatEl.className = 'floating-plus';
    floatEl.textContent = '+1';

    let x = e.clientX;
    let y = e.clientY;

    if (!x || !y) {
        const rect = clickMeBtn.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 3;
    }

    floatEl.style.left = `${x}px`;
    floatEl.style.top = `${y}px`;

    document.body.appendChild(floatEl);

    setTimeout(() => {
        floatEl.remove();
    }, 600);
}

function finishGame() {
    clearInterval(timerInterval);
    isGameRunning = false;
    isCountingDown = false;
    playBeepSound(true);

    const cps = (currentClicks / selectedDuration).toFixed(2);
    const previousHs = highScores[selectedDuration] || 0;
    let isNewRecord = false;

    if (currentClicks > previousHs) {
        highScores[selectedDuration] = currentClicks;
        localStorage.setItem(`clicker_hs_${selectedDuration}`, currentClicks);
        isNewRecord = true;
    }

    resTotalClicks.textContent = currentClicks;
    resCps.textContent = cps;
    resDuration.innerHTML = `${selectedDuration}<br><small>Seconds</small>`;

    if (isNewRecord && currentClicks > 0) {
        resultHeadingTitle.textContent = "Awesome! 🎉";
        resultHeadingSub.textContent = "You set a new record!";
        hsBadgeTitle.textContent = "New High Score!";
        hsCardValue.textContent = `${currentClicks} clicks`;
        triggerConfetti();
    } else {
        resultHeadingTitle.textContent = "Awesome!";
        resultHeadingSub.textContent = "You did great!";
        hsBadgeTitle.textContent = "Best Score";
        hsCardValue.textContent = `${highScores[selectedDuration]} clicks`;
    }

    showScreen(viewResult);
}

function triggerConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#c59b27', '#0b2545', '#38bdf8', '#f59e0b', '#10b981'];

    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.5}s`;
        confettiContainer.appendChild(piece);
    }
}

// -------------------------------------------------------------------
// 7. UTILITIES
// -------------------------------------------------------------------
function toggleSound() {
    isSoundMuted = !isSoundMuted;
    localStorage.setItem('clicker_sound_muted', isSoundMuted);
    updateSoundUI();
}

function updateSoundUI() {
    if (isSoundMuted) {
        soundIcon.textContent = '🔇';
        soundToggleBtn.style.opacity = '0.6';
    } else {
        soundIcon.textContent = '🔊';
        soundToggleBtn.style.opacity = '1';
    }
}

// Custom High Score Modal Elements
const highScoreModal = document.getElementById('highScoreModal');
const closeHsModalBtn = document.getElementById('closeHsModalBtn');
const modalResetHsBtn = document.getElementById('modalResetHsBtn');
const hsModal10 = document.getElementById('hsModal10');
const hsModal15 = document.getElementById('hsModal15');
const hsModal30 = document.getElementById('hsModal30');

function openHighScoreModal() {
    hsModal10.textContent = `${highScores['10']} klik`;
    hsModal15.textContent = `${highScores['15']} klik`;
    hsModal30.textContent = `${highScores['30']} klik`;
    highScoreModal.classList.remove('hidden');
}

function closeHighScoreModal() {
    highScoreModal.classList.add('hidden');
}

function resetHighScores() {
    if (confirm("Apakah Anda yakin ingin mereset semua High Score?")) {
        highScores = { '10': 0, '15': 0, '30': 0 };
        localStorage.removeItem('clicker_hs_10');
        localStorage.removeItem('clicker_hs_15');
        localStorage.removeItem('clicker_hs_30');
        
        if (hsCardValue) hsCardValue.textContent = `0 clicks`;
        if (hsBadgeTitle) hsBadgeTitle.textContent = "Best Score";
        
        hsModal10.textContent = `0 klik`;
        hsModal15.textContent = `0 klik`;
        hsModal30.textContent = `0 klik`;
        alert("High Score berhasil di-reset!");
    }
}

document.addEventListener('DOMContentLoaded', initGame);
