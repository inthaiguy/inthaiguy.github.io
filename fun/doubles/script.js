// JavaScript for Net Worth Doubles Calculator
// https://www.empower.com/the-currency/life/average-net-worth-by-age

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

// Function to add commas to a number
function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to remove commas from a formatted number
function removeCommas(formattedNumber) {
    return formattedNumber.replace(/,/g, '');
}

// Add event listener to format netWorth input on input
const netWorthInputField = document.getElementById('netWorth');

netWorthInputField.addEventListener('input', function(e) {
    const cursorPosition = netWorthInputField.selectionStart;
    const rawValue = removeCommas(netWorthInputField.value);
    
    // Allow only digits
    if (!/^\d*$/.test(rawValue)) {
        netWorthInputField.value = addCommas(rawValue.replace(/\D/g, ''));
        return;
    }
    
    netWorthInputField.value = addCommas(rawValue);
    
    // Adjust cursor position
    const commasBeforeCursor = (netWorthInputField.value.slice(0, cursorPosition).match(/,/g) || []).length;
    netWorthInputField.selectionEnd = cursorPosition + commasBeforeCursor;
});

document.getElementById('doublesForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form submission

    // Clear previous results and errors
    document.getElementById('result').innerHTML = '';
    document.getElementById('errorMsg').innerText = '';

    // Get user inputs
    const ageInput = document.getElementById('age').value.trim();
    const netWorthInput = document.getElementById('netWorth').value.trim();

    // Input validation
    if (ageInput === '' || netWorthInput === '') {
        document.getElementById('errorMsg').innerText = 'Please fill in both fields.';
        return;
    }

    const age = parseInt(ageInput);
    const netWorth = parseFloat(removeCommas(netWorthInput));

    if (isNaN(age) || isNaN(netWorth) || age < 10 || age > 99 || netWorth < 1) {
        document.getElementById('errorMsg').innerText = 'Please enter valid age and net worth.';
        return;
    }

    // Function to calculate number of doubles without exceeding net worth
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

    // Determine the age decade
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

    // Get average doubles from the table
    const avgDoubles = averageDoublesTable[decade] || 'N/A';

    // Calculate doubles needed to become a millionaire or billionaire
    let additionalLine = '';
    if (netWorth < 1_000_000) {
        const doublesToMillion = 20 - userDoubles;
        additionalLine = `Double ${doublesToMillion > 0 ? doublesToMillion : 0} more times to become a millionaire.`;
    } else {
        const doublesToBillion = 30 - userDoubles;
        additionalLine = `Double ${doublesToBillion > 0 ? doublesToBillion : 0} more times to become a billionaire.`;
    }

    // Generate emojis based on userDoubles
    let emojisHTML = '';
    if (userDoubles > 0) {
        const maxEmojis = 40; // Maximum of 40 emojis (20 per row * 2 rows)
        const displayDoubles = userDoubles > maxEmojis ? maxEmojis : userDoubles;
        let emojis = '💵'.repeat(displayDoubles);

        // Insert <br> after 20 emojis to create two rows
        if (displayDoubles > 20) {
            emojis = '💵'.repeat(20) + '<br>' + '💵'.repeat(displayDoubles - 20);
        }

        emojisHTML = `<div class="emojis-container">${emojis}</div>`;
    }

    // Display the results
    let resultHTML = `<p>You’ve doubled your money <strong>${userDoubles}</strong> times!</p>`;
    if (avgDoubles !== 'N/A') {
        resultHTML += `<p>The Average <strong>${age}</strong> year old has doubled their money <strong>${avgDoubles}</strong> times.</p>`;
    } else {
        resultHTML += `<p>Average doubles data not available for your age group.</p>`;
    }
    resultHTML += `<p>${additionalLine}</p>`;
    resultHTML += emojisHTML;

    document.getElementById('result').innerHTML = resultHTML;
});