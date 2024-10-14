const editor = document.getElementById('editor');
let effectsCount = {}; // Keep track of how many times each effect has happened

// Check if effect limit is reached (3 times per character)
function canApplyEffect(char) {
    if (!effectsCount[char]) effectsCount[char] = 0;
    if (effectsCount[char] < 23) {
        effectsCount[char]++;
        return true;
    }
    return false;
}

// Listen for input in the editable div
editor.addEventListener('input', function(event) {
    let text = editor.innerText;  // Get the current text
    editor.innerHTML = '';  // Clear the editor to replace with styled text

    // Process each character and apply quirky variations
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let span = document.createElement('span');  // Create a span for each character
        span.textContent = char;  // Set the text for the span

        // Apply quirky styles
        if (char === 'a' && canApplyEffect('a')) {
            span.classList.add('large-a');
        } else if (char === 'b' && canApplyEffect('b')) {
            span.classList.add('small-b');
        } else if (char === 'c' && canApplyEffect('c')) {
            span.classList.add('spin-c');
        } else if (char === 'd' && canApplyEffect('d')) {
            span.classList.add('large-d');
        } else if (char === 'e' && canApplyEffect('e')) {
            span.classList.add('red-e');
        } else if (char === 'g' && canApplyEffect('g')) {
            span.classList.add('fade-g');
        } else if (char === 'h' && canApplyEffect('h')) {
            span.classList.add('blue-h');
        } else if (char === 'j' && canApplyEffect('j')) {
            span.classList.add('tilt-j');
        } else if (char === 'k' && canApplyEffect('k')) {
            span.classList.add('wobble-k');
        } else if (char === 'l' && canApplyEffect('l')) {
            span.classList.add('spin-l');
        } else if (char === 'm' && canApplyEffect('m')) {
            span.classList.add('flip-m');
            setTimeout(() => {
                span.style.transform = 'rotate(360deg)';
            }, 100);  // Flip after 100ms
        } else if (char === 'n' && canApplyEffect('n')) {
            span.classList.add('large-n');
        } else if (char === 'o' && canApplyEffect('o')) {
            span.classList.add('spin-o');
            setTimeout(() => { span.classList.remove('spin-o'); }, 100);  // Spin for 100ms
        } else if (char === 'p' && canApplyEffect('p')) {
            span.classList.add('rotate-p');
            setTimeout(() => {
                span.style.transform = 'rotateX(0deg)';
            }, 200);  // Rotate back after 200ms
        } else if (char === 'q' && canApplyEffect('q')) {
            span.textContent = 'Q'; // Print as uppercase Q
        } else if (char === 'r' && canApplyEffect('r')) {
            span.classList.add('green-r');
        } else if (char === 's' && canApplyEffect('s')) {
            span.classList.add('rotate-s');
        } else if (char === 't' && canApplyEffect('t')) {
            span.classList.add('blue-t');
        } else if (char === 'u' && canApplyEffect('u')) {
            span.classList.add('mirror-u');
        } else if (char === 'v' && canApplyEffect('v')) {
            span.classList.add('grow-v');
        } else if (char === 'w' && canApplyEffect('w')) {
            span.classList.add('rotate-w');
        } else if (char === 'x' && canApplyEffect('x')) {
            span.classList.add('large-grey-x');
        } else if (char === 'y' && canApplyEffect('y')) {
            span.classList.add('green-y');
        } else if (char === 'z' && canApplyEffect('z')) {
            span.classList.add('small-z');
        }

        editor.appendChild(span);  // Add the span back to the editor
    }

   
    placeCaretAtEnd(editor);  // Move the cursor to the end
});

// Function to move the caret (cursor) to the end of the contenteditable div
function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
        let range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        let sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
}