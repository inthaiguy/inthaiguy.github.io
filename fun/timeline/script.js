document.addEventListener('DOMContentLoaded', function () {
    const timeline = document.getElementById('timeline');
    let zoomLevel = 1; // Initial zoom level (1x)

    // CSV file URL
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGfo5oxrOUKeb0mOilUhAO5DqZCvXmQwvkpAcoBqAPC0kOutgAQ23Cx_rm2WJeQQ8rosO1f_QyyhCP/pub?gid=0&single=true&output=csv';

    // Create the horizontal line for the timeline
    const line = document.createElement('div');
    line.classList.add('timeline-line');
    document.querySelector('.timeline-container').appendChild(line);

    // Function to load and parse CSV data
    async function loadCSV() {
        try {
            const response = await fetch(csvUrl);
            const csvText = await response.text();
            parseCSV(csvText);
        } catch (error) {
            console.error('Error loading CSV data:', error);
        }
    }

    // Function to parse CSV text data and populate the timeline
    function parseCSV(data) {
        const rows = data.split('\n').slice(1); // Skip header row
        rows.forEach((row, index) => {
            const columns = row.split(',');
            const year = columns[0];
            const inventions = columns[1];
            const worldEvents = columns[2];
            const localEvents = columns[3];
            const population = columns[4];
            const density = columns[5];
            const urbanPop = columns[6];
            const inflation = columns[9];

            // Only create an item if the year and some data exist
            if (year && (inventions || worldEvents || localEvents)) {
                const item = document.createElement('div');
                item.classList.add('timeline-item');
                item.innerHTML = `<strong>${year}</strong><br>
                                  <em>Inventions:</em> ${inventions || 'N/A'}<br>
                                  <em>World Events:</em> ${worldEvents || 'N/A'}<br>
                                  <em>Local Events:</em> ${localEvents || 'N/A'}<br>
                                  <em>Population:</em> ${population || 'N/A'}<br>
                                  <em>Density:</em> ${density || 'N/A'}<br>
                                  <em>Urban Pop %:</em> ${urbanPop || 'N/A'}<br>
                                  <em>Inflation Rate:</em> ${inflation || 'N/A'}`;
                timeline.appendChild(item);

                // Create dot for the timeline line
                const dot = document.createElement('div');
                dot.classList.add('timeline-dot');
                dot.style.left = `${index * 200}px`; // Space dots evenly based on index
                document.querySelector('.timeline-container').appendChild(dot);

                // Create year marker near the dot
                const yearMarker = document.createElement('div');
                yearMarker.classList.add('timeline-year');
                yearMarker.style.left = `${index * 200}px`;
                yearMarker.textContent = year;
                document.querySelector('.timeline-container').appendChild(yearMarker);
            }
        });
    }

    // Zoom in and out functionality
    function zoomIn() {
        zoomLevel = Math.min(zoomLevel + 0.1, 2); // Max zoom level 2x
        updateZoom();
    }

    function zoomOut() {
        zoomLevel = Math.max(zoomLevel - 0.1, 0.5); // Min zoom level 0.5x
        updateZoom();
    }

    function updateZoom() {
        document.body.style.fontSize = `${zoomLevel}rem`;
        timeline.style.transform = `scale(${zoomLevel})`;
    }

    // Add keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'PageDown') {
            timeline.scrollBy({ left: 300, behavior: 'smooth' });
        } else if (e.key === 'PageUp') {
            timeline.scrollBy({ left: -300, behavior: 'smooth' });
        } else if (e.key === '+' || e.key === '=') {
            zoomIn();
        } else if (e.key === '-') {
            zoomOut();
        }
    });

    // Load CSV data on page load
    loadCSV();
});