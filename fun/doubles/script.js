// JavaScript for Net Worth Doubles Calculator

// Mapping of age decades to average doubles
const averageDoublesTable = {
    '10s': 10,
    '20s': 12,
    '30s': 15,
    '40s': 17,
    '50s': 18,
    '60s': 18,
    '70s': 18,
    '80s': 18,
    '90s': 18
};

// Function to add commas to a number for better readability
function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas from a formatted number for accurate parsing
function removeCommas(formattedNumber) {
    return formattedNumber.replace(/,/g, '');
}

// Function to detect if the device is mobile
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Add event listener to format netWorth input with commas as the user types
const netWorthInputField = document.getElementById('netWorth');

netWorthInputField.addEventListener('input', function(e) {
    const cursorPosition = netWorthInputField.selectionStart;
    const rawValue = removeCommas(netWorthInputField.value);

    // Allow only digits; remove any non-digit characters
    if (!/^\d*$/.test(rawValue)) {
        netWorthInputField.value = addCommas(rawValue.replace(/\D/g, ''));
        return;
    }

    // Add commas to the formatted number
    netWorthInputField.value = addCommas(rawValue);

    // Calculate the number of commas before the cursor to maintain cursor position
    const commasBeforeCursor = (netWorthInputField.value.slice(0, cursorPosition).match(/,/g) || []).length;
    netWorthInputField.selectionEnd = cursorPosition + commasBeforeCursor;
});

// Add event listener for form submission to perform calculations
document.getElementById('doublesForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    // Clear previous results and error messages
    document.getElementById('result').innerHTML = '';
    document.getElementById('errorMsg').innerText = '';

    // Retrieve user inputs
    const ageInput = document.getElementById('age').value.trim();
    const netWorthInput = document.getElementById('netWorth').value.trim();

    // Validate that both fields are filled
    if (ageInput === '' || netWorthInput === '') {
        document.getElementById('errorMsg').innerText = 'Please fill in both fields.';
        return;
    }

    // Parse the inputs into integers
    const age = parseInt(ageInput);
    const netWorth = parseFloat(removeCommas(netWorthInput));

    // Validate the parsed inputs
    if (isNaN(age) || isNaN(netWorth) || age < 10 || age > 99 || netWorth < 1) {
        document.getElementById('errorMsg').innerText = 'Please enter valid age and net worth.';
        return;
    }

    // Function to calculate the number of doubles without exceeding the net worth
    function calculateDoubles(netWorth) {
        let doubles = 0;
        let amount = 1;
        while (amount * 2 <= netWorth) {
            amount *= 2;
            doubles++;
        }
        return doubles;
    }

    const userDoubles = calculateDoubles(netWorth);

    // Determine the user's age decade for average comparison
    let decade = '';
    if (age >= 10 && age < 20) {
        decade = '10s';
    } else if (age >= 20 && age < 30) {
        decade = '20s';
    } else if (age >= 30 && age < 40) {
        decade = '30s';
    } else if (age >= 40 && age < 50) {
        decade = '40s';
    } else if (age >= 50 && age < 60) {
        decade = '50s';
    } else if (age >= 60 && age < 70) {
        decade = '60s';
    } else if (age >= 70 && age < 80) {
        decade = '70s';
    } else if (age >= 80 && age < 90) {
        decade = '80s';
    } else if (age >= 90 && age < 100) {
        decade = '90s';
    } else {
        decade = 'Unknown';
    }

    // Retrieve the average number of doubles for the user's age decade
    const avgDoubles = averageDoublesTable[decade] || 'N/A';

    // Calculate additional doubles needed to become a millionaire or billionaire
    let additionalLine = '';
    if (netWorth < 1_000_000) {
        const doublesToMillion = 20 - userDoubles;
        additionalLine = `Double ${doublesToMillion > 0 ? doublesToMillion : 0} more times to become a millionaire.`;
    } else {
        const doublesToBillion = 30 - userDoubles;
        additionalLine = `Double ${doublesToBillion > 0 ? doublesToBillion : 0} more times to become a billionaire.`;
    }

    // Generate a single image based on userDoubles
    let imagesHTML = '';
    if (userDoubles > 0) {
        const maxImage = 30; // Maximum image number available
        const displayDoubles = userDoubles > maxImage ? maxImage : userDoubles;
        imagesHTML = `<div class="images-container"><img src="imgs/${displayDoubles}.png" alt="Double ${displayDoubles}" class="double-image"></div>`;
    }

    // Compile the result HTML with images first, followed by textual information
    let resultHTML = imagesHTML; // Insert images first

    resultHTML += `<p>You’ve doubled your money <strong>${userDoubles}</strong> times!</p>`;
    if (avgDoubles !== 'N/A') {
        resultHTML += `<p>The Average <strong>${age}</strong> year old has doubled their money <strong>${avgDoubles}</strong> times.</p>`;
    } else {
        resultHTML += `<p>Average doubles data not available for your age group.</p>`;
    }
    resultHTML += `<p>${additionalLine}</p>`;

    // Insert the compiled HTML into the result div
    document.getElementById('result').innerHTML = resultHTML;

       // After the image is in the DOM, add event listeners for hover animation or auto-cycling
       const doubleImage = document.querySelector('.double-image');
       if (doubleImage) {
           if (isMobileDevice()) {
               // Mobile: Auto-cycling at 330ms upon first load
               let currentIndex = 1;
               const maxImage = userDoubles > 30 ? 30 : userDoubles;
               doubleImage.src = `imgs/${currentIndex}.png`;
   
               const mobileInterval = setInterval(function() {
                   currentIndex++;
                   if (currentIndex > maxImage) {
                       clearInterval(mobileInterval);
                       doubleImage.src = `imgs/${maxImage}.png`;
                   } else {
                       doubleImage.src = `imgs/${currentIndex}.png`;
                   }
               }, 330); // 330ms interval
           } else {
               // Desktop: On hover, cycle at 200ms
               let intervalId = null;
               let currentIndex = 1;
   
               doubleImage.addEventListener('mouseover', function() {
                   // Prevent multiple intervals
                   if (intervalId) return;
   
                   currentIndex = 1;
                   intervalId = setInterval(function() {
                       if (currentIndex > userDoubles) {
                           clearInterval(intervalId);
                           intervalId = null;
                           return;
                       }
                       doubleImage.src = `imgs/${currentIndex}.png`;
                       currentIndex++;
                   }, 200); // 200ms interval
               });
   
               doubleImage.addEventListener('mouseout', function() {
                   if (intervalId) {
                       clearInterval(intervalId);
                       intervalId = null;
                   }
                   // Reset to the final image
                   doubleImage.src = `imgs/${userDoubles > 30 ? 30 : userDoubles}.png`;
               });
           }
       }
   });