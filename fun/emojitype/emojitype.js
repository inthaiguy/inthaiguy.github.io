// JavaScript for the random emoji typing effect
const editor = document.getElementById('editor');

// Mapping between letters and their corresponding emoji lists
const emojiMap = {
    'a': ['🍎', '🐜', '🦄', '🚀', '👽'],
    'b': ['🫧', '🍌', '🐝', '👶', '🚴'],
    'c': ['🐈', '🍪', '🐄', '🐬', '📸'],
    'd': ['🐶', '🍩', '🦕', '🚗', '💃'],
    'e': ['🥚', '🦅', '🍆', '👁️', '🐘'],
    // Add more mappings for other letters as needed
    'f': ['🍟', '🐸', '🦊', '👣'],
    'g': ['🍇', '🦍', '🐐', '🎸'],
    'h': ['🌺', '🏠'],
    'i': ['🍦', '📱'],
    'j': ['🧃'],
    'k': ['🔑', '🥝', '🦘', '🐨'],
    'l': ['🦁', '🍋', '🍂', '🦙', '🔗'],
    'm': ['🍉', '🐒', '🎤', '🧠', '🍈'],
    'n': ['🥜', '🎶'],
    'o': ['🍊', '🐙', '🦉', '🥚', '🚪'],
    'p': ['🍕', '🐧', '🥞', '🎨', '📎'],
    'q': ['👑', '🦆'],
    'r': ['🍓', '🐀', '🚀', '🤖', '🔴'],
    's': ['🍣', '🐍', '☀️'],
    't': ['🦖', '🐢', '📞', '🧸'],
    'u': ['🦄', '☂️', '🛳️'],
    'v': ['🌋', '🎻','🏐'],
    'w': ['🍉', '🐋', '🚶','🌊'],
    'x': ['❌'],
    'y': ['🟡'],
    'z': ['🦓'],
};

// Function to get a random emoji from the emoji map
function getRandomEmoji(letter) {
    const emojiList = emojiMap[letter.toLowerCase()];
    if (!emojiList) return letter; // Return the letter if no emoji mapping is found
    const randomIndex = Math.floor(Math.random() * emojiList.length);
    return emojiList[randomIndex];
}

// Listen for input in the editable div
editor.addEventListener('input', function() {
    let text = editor.innerText; // Get the current text
    editor.innerHTML = ''; // Clear the editor

    // Process each character typed and replace it with a random emoji
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let span = document.createElement('span'); // Create a span for each character

        // Get a random emoji corresponding to the typed letter
        span.textContent = getRandomEmoji(char);

        editor.appendChild(span); // Add the emoji or text back to the editor
    }

    // Move the cursor to the end after typing
    placeCaretAtEnd(editor);
});

// Function to move the caret (cursor) to the end of the contenteditable div
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}