const editor = document.getElementById('editor');
const quirkStatus = document.getElementById('quirk-status');
let effectsCount = {}; // Keep track of how many times each effect has happened
let latestEffect = 'ready';

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

        const lowerChar = char.toLowerCase();

        // Apply quirky styles
        if (lowerChar === 'a' && canApplyEffect('a')) {
            span.classList.add('large-a');
            latestEffect = 'big a';
        } else if (lowerChar === 'b' && canApplyEffect('b')) {
            span.classList.add('small-b');
            latestEffect = 'tiny b';
        } else if (lowerChar === 'c' && canApplyEffect('c')) {
            span.classList.add('spin-c');
            latestEffect = 'spinning c';
        } else if (lowerChar === 'd' && canApplyEffect('d')) {
            span.classList.add('large-d');
            latestEffect = 'large d';
        } else if (lowerChar === 'e' && canApplyEffect('e')) {
            span.classList.add('red-e');
            latestEffect = 'red e';
        } else if (lowerChar === 'f' && canApplyEffect('f')) {
            span.classList.add('float-f');
            latestEffect = 'floating f';
        } else if (lowerChar === 'g' && canApplyEffect('g')) {
            span.classList.add('fade-g');
            latestEffect = 'fading g';
        } else if (lowerChar === 'h' && canApplyEffect('h')) {
            span.classList.add('blue-h');
            latestEffect = 'blue h';
        } else if (lowerChar === 'i' && canApplyEffect('i')) {
            span.classList.add('tall-i');
            latestEffect = 'tall i';
        } else if (lowerChar === 'j' && canApplyEffect('j')) {
            span.classList.add('tilt-j');
            latestEffect = 'tilted j';
        } else if (lowerChar === 'k' && canApplyEffect('k')) {
            span.classList.add('wobble-k');
            latestEffect = 'wobbling k';
        } else if (lowerChar === 'l' && canApplyEffect('l')) {
            span.classList.add('spin-l');
            latestEffect = 'spinning l';
        } else if (lowerChar === 'm' && canApplyEffect('m')) {
            span.classList.add('flip-m');
            setTimeout(() => {
                span.style.transform = 'rotate(360deg)';
            }, 100);  // Flip after 100ms
            latestEffect = 'flipping m';
        } else if (lowerChar === 'n' && canApplyEffect('n')) {
            span.classList.add('large-n');
            latestEffect = 'large n';
        } else if (lowerChar === 'o' && canApplyEffect('o')) {
            span.classList.add('spin-o');
            setTimeout(() => { span.classList.remove('spin-o'); }, 100);  // Spin for 100ms
            latestEffect = 'spinning o';
        } else if (lowerChar === 'p' && canApplyEffect('p')) {
            span.classList.add('rotate-p');
            setTimeout(() => {
                span.style.transform = 'rotateX(0deg)';
            }, 200);  // Rotate back after 200ms
            latestEffect = 'rotating p';
        } else if (lowerChar === 'q' && canApplyEffect('q')) {
            span.textContent = 'Q'; // Print as uppercase Q
            span.classList.add('upper-q');
            latestEffect = 'uppercase q';
        } else if (lowerChar === 'r' && canApplyEffect('r')) {
            span.classList.add('green-r');
            latestEffect = 'green r';
        } else if (lowerChar === 's' && canApplyEffect('s')) {
            span.classList.add('rotate-s');
            latestEffect = 'rotated s';
        } else if (lowerChar === 't' && canApplyEffect('t')) {
            span.classList.add('blue-t');
            latestEffect = 'blue t';
        } else if (lowerChar === 'u' && canApplyEffect('u')) {
            span.classList.add('mirror-u');
            latestEffect = 'mirrored u';
        } else if (lowerChar === 'v' && canApplyEffect('v')) {
            span.classList.add('grow-v');
            latestEffect = 'growing v';
        } else if (lowerChar === 'w' && canApplyEffect('w')) {
            span.classList.add('rotate-w');
            latestEffect = 'rotated w';
        } else if (lowerChar === 'x' && canApplyEffect('x')) {
            span.classList.add('large-grey-x');
            latestEffect = 'large x';
        } else if (lowerChar === 'y' && canApplyEffect('y')) {
            span.classList.add('green-y');
            latestEffect = 'green y';
        } else if (lowerChar === 'z' && canApplyEffect('z')) {
            span.classList.add('small-z');
            latestEffect = 'small z';
        } else if (/[0-9]/.test(char) && canApplyEffect('number')) {
            span.classList.add('number-pop');
            latestEffect = 'number pop';
        } else if (char === '!' && canApplyEffect('bang')) {
            span.classList.add('bang');
            latestEffect = 'bang';
        } else if (char === '?' && canApplyEffect('question')) {
            span.classList.add('question');
            latestEffect = 'question mark';
        } else if (char === '.' && canApplyEffect('dot')) {
            span.classList.add('dot');
            latestEffect = 'dot';
        } else if (char === ',' && canApplyEffect('comma')) {
            span.classList.add('comma');
            latestEffect = 'comma';
        }

        editor.appendChild(span);  // Add the span back to the editor
    }

    quirkStatus.textContent = `Latest quirk: ${latestEffect}`;
   
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
