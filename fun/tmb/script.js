// script.js

document.getElementById('startButton').addEventListener('click', startCounter);

function startCounter() {
    document.getElementById('startButton').style.display = 'none';

    const startDate = new Date('October 17, 1976');
    const endDate = new Date();
    const totalMonths = monthDiff(startDate, endDate);
    const totalSeconds = 30;
    const intervalTime = totalSeconds / totalMonths * 1000;

    let currentMonth = startDate.getMonth();
    let currentYear = startDate.getFullYear();
    let counterElement = document.getElementById('counter');
    let imageContainer = document.getElementById('imageContainer');
    let images = [];
    let imageYears = [];

    // Load images from the imgs directory
    for (let year = startDate.getFullYear(); year <= endDate.getFullYear(); year++) {
        let img = new Image();
        img.src = `./imgs/${year}.png`;
        img.alt = `${year}`;
        img.onload = function() {
            images[year] = img;
            imageYears.push(year);
        };
        img.onerror = function() {
            // If .jpg is not found, try .png
            img.src = `./imgs/${year}.jpg`;
            img.onload = function() {
                images[year] = img;
                imageYears.push(year);
            };
        };
    }

    let index = 0;
    let interval = setInterval(() => {
        if (currentYear > endDate.getFullYear() || (currentYear === endDate.getFullYear() && currentMonth > endDate.getMonth())) {
            clearInterval(interval);
            showHappyBirthday();
            return;
        }

        counterElement.textContent = formatDate(currentYear, currentMonth);

        // Check if there is an image for the current year
        if (imageYears.includes(currentYear)) {
            showImage(images[currentYear]);
        }

        // Increment month and year
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
    }, intervalTime);
}

// Function to calculate the difference in months between two dates
function monthDiff(d1, d2) {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

// Function to format date as "Month Year"
function formatDate(year, month) {
    const date = new Date(year, month);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString(undefined, options);
}

// Function to show images with fade effect
function showImage(img) {
    let container = document.getElementById('imageContainer');
    container.innerHTML = '';
    img.style.opacity = '0';
    container.appendChild(img);
    setTimeout(() => {
        img.style.opacity = '1';
    }, 10);
}

// Function to display the "Happy Birthday" message
function showHappyBirthday() {
    document.getElementById('counter').style.display = 'none';
    document.getElementById('imageContainer').style.display = 'none';
    document.getElementById('happyBirthday').style.opacity = '1';
}
