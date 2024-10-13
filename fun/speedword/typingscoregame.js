// JavaScript for the typing score game

const editor = document.getElementById('editor');
const scoreDisplay = document.getElementById('score');

let score = 0;
let currentWord = '';
let startTime = 0;

// Function to calculate score based on word length and typing speed
function calculateScore(word, timeTaken) {
    const wordLength = word.length;
    const timeInSeconds = timeTaken / 1000;

    // Updated scoring formula: (word length ^ 2 * 100) / time in seconds
    return Math.round((Math.pow(wordLength, 2) * 100) / timeInSeconds);
}

// Listen for input in the contenteditable div
editor.addEventListener('input', function(event) {
    const text = editor.innerText; // Get the current text
    const lastChar = text.slice(-1);

    if (startTime === 0) {
        startTime = Date.now(); // Start the timer when typing begins
    }

    if (lastChar === ' ' || lastChar === '\n') {
        // User finished typing a word (space or enter pressed)
        const endTime = Date.now();
        const timeTaken = endTime - startTime;

        // Remove trailing space or newline
        currentWord = text.trim();
        if (currentWord.length > 0) {
            // Calculate the score using the updated formula
            const wordScore = calculateScore(currentWord, timeTaken);
            score += wordScore; // Update the total score
            scoreDisplay.textContent = `Score: ${score}`;
        }

        // Reset for the next word
        editor.innerHTML = ''; // Clear the editor for the next word
        currentWord = '';
        startTime = 0; // Reset the timer
    }
});

// Function to move the caret (cursor) to the end of the contenteditable div
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}