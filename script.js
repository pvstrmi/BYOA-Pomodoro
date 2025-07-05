const timerSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2330/2330-preview.mp3');

let timeLeft;
let timerId = null;

const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const pomodoroButton = document.getElementById('pomodoro');
const shortBreakButton = document.getElementById('short-break');
const longBreakButton = document.getElementById('long-break');
const modeIcon = document.getElementById('mode-icon');

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    // Update URL and tab title with countdown time
    updateUrlAndTitle(timeString);

    if (timeLeft === 0) {
        clearInterval(timerId);
        timerId = null;
        timerSound.play();
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
        // Clear URL and title when timer ends
        updateUrlAndTitle('');
    }
}

function updateUrlAndTitle(timeString) {
    // Update browser tab title
    if (timeString) {
        document.title = `(${timeString}) Pomodoro Timer`;
    } else {
        document.title = 'Pomodoro Timer';
    }
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (timeString) {
        url.searchParams.set('time', timeString);
    } else {
        url.searchParams.delete('time');
    }
    window.history.replaceState({}, '', url);
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = 25 * 60; // 25 minutes in seconds
    updateTimer();
    setModeIcon('work');
}

function setPomodoro() {
    timeLeft = 25 * 60; // 25 minutes in seconds
    updateTimer();
    setActiveButton(pomodoroButton);
    setModeIcon('work');
}

function setShortBreak() {
    timeLeft = 5 * 60; // 5 minutes in seconds
    updateTimer();
    setActiveButton(shortBreakButton);
    setModeIcon('rest');
}

function setLongBreak() {
    timeLeft = 15 * 60; // 15 minutes in seconds
    updateTimer();
    setActiveButton(longBreakButton);
    setModeIcon('rest');
}

function setModeIcon(mode) {
    if (!modeIcon) return;
    if (mode === 'work') {
        // Sun SVG (iOS style)
        modeIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#f7b500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" fill="#f7b500"/><g stroke="#f7b500"><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g></svg>`;
    } else {
        // Moon SVG (iOS style)
        modeIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="#6d6d6d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" fill="#bfc7d1"/></svg>`;
    }
}

function setActiveButton(button) {
    [pomodoroButton, shortBreakButton, longBreakButton].forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

// Initialize
setPomodoro();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
pomodoroButton.addEventListener('click', setPomodoro);
shortBreakButton.addEventListener('click', setShortBreak);
longBreakButton.addEventListener('click', setLongBreak);

// Enable sound on mobile
document.addEventListener('click', () => {
    timerSound.load();
}); 