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
}

function setPomodoro() {
    timeLeft = 25 * 60; // 25 minutes in seconds
    updateTimer();
    setActiveButton(pomodoroButton);
}

function setShortBreak() {
    timeLeft = 5 * 60; // 5 minutes in seconds
    updateTimer();
    setActiveButton(shortBreakButton);
}

function setLongBreak() {
    timeLeft = 15 * 60; // 15 minutes in seconds
    updateTimer();
    setActiveButton(longBreakButton);
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