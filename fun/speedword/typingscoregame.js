const words = [
    'island', 'banana', 'rocket', 'puzzle', 'silver', 'button', 'dragon',
    'window', 'yellow', 'typing', 'summer', 'family', 'garden', 'coffee',
    'school', 'planet', 'pirate', 'orange', 'jungle', 'castle', 'beacon',
    'marble', 'thunder', 'cookie', 'travel', 'camera', 'forest', 'bubble'
];

const answer = document.getElementById('answer');
const message = document.getElementById('message');
const restart = document.getElementById('restart');
const scoreDisplay = document.getElementById('score');
const streakDisplay = document.getElementById('streak');
const targetWordDisplay = document.getElementById('target-word');
const timeDisplay = document.getElementById('time');

let currentWord = '';
let gameStarted = false;
let lastWord = '';
let score = 0;
let streak = 0;
let timer = null;
let timeLeft = 30;

function chooseWord() {
    let nextWord = words[Math.floor(Math.random() * words.length)];
    while (nextWord === lastWord) {
        nextWord = words[Math.floor(Math.random() * words.length)];
    }
    lastWord = nextWord;
    currentWord = nextWord;
    targetWordDisplay.textContent = currentWord;
}

function render() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    timeDisplay.textContent = timeLeft;
}

function startGame() {
    if (gameStarted) {
        return;
    }

    gameStarted = true;
    message.textContent = 'Press space or enter after each word.';
    timer = window.setInterval(() => {
        timeLeft -= 1;
        render();

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    window.clearInterval(timer);
    timer = null;
    gameStarted = false;
    answer.disabled = true;
    answer.value = '';
    message.textContent = `Time! Final score: ${score}.`;
}

function resetGame() {
    window.clearInterval(timer);
    timer = null;
    gameStarted = false;
    score = 0;
    streak = 0;
    timeLeft = 30;
    answer.disabled = false;
    answer.value = '';
    answer.className = '';
    message.textContent = 'Start typing to begin.';
    chooseWord();
    render();
    answer.focus();
}

function submitWord() {
    const typedWord = answer.value.trim().toLowerCase();

    if (!typedWord) {
        answer.value = '';
        return;
    }

    if (typedWord === currentWord) {
        streak += 1;
        score += currentWord.length * 10 + streak * 5;
        message.textContent = `Nice: +${currentWord.length * 10 + streak * 5}`;
        answer.className = 'correct';
        chooseWord();
    } else {
        streak = 0;
        message.textContent = `Missed: ${currentWord}`;
        answer.className = 'wrong';
    }

    answer.value = '';
    render();
}

answer.addEventListener('keydown', (event) => {
    if (event.key !== ' ' && event.key !== 'Enter') {
        return;
    }

    event.preventDefault();
    startGame();
    submitWord();
});

answer.addEventListener('input', startGame);
restart.addEventListener('click', resetGame);
document.addEventListener('click', () => answer.focus());

resetGame();
