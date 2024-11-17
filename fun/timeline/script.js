document.addEventListener('DOMContentLoaded', function () {
    const timeline = document.getElementById('timeline');
    let zoomLevel = 1; // Initial zoom level (1x)

    // HTML page URL (published as a webpage)
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGfo5oxrOUKeb0mOilUhAO5DqZCvXmQwvkpAcoBqAPC0kOutgAQ23Cx_rm2WJeQQ8rosO1f_QyyhCP/pubhtml?gid=0&single=true';

    // Function to load and parse HTML page data
    async function loadHTMLSheet() {
        try {
            const response = await fetch(sheetUrl);
            const htmlText = await response.text();
            parseHTML(htmlText);
        } catch (error) {
            console.error('Error loading HTML page:', error);
        }
    }

    // Function to parse HTML text and populate the timeline
    function parseHTML(data) {
        // Create a new DOM parser to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        // Select table rows where the data is stored in the published sheet
        const rows = doc.querySelectorAll('table tbody tr');

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 10) return; // Skip rows with insufficient data

            const year = cells[0].innerText.trim();
            const inventions = cells[1].innerText.trim();
            const worldEvents = cells[2].innerText.trim();
            const localEvents = cells[3].innerText.trim();
            const population = cells[4].innerText.trim();
            const density = cells[5].innerText.trim();
            const urbanPop = cells[6].innerText.trim();
            const inflation = cells[9].innerText.trim();

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

    // Load HTML sheet data on page load
    loadHTMLSheet();
});

// Function to parse HTML text and populate the timeline
function parseHTML(data) {
    // Create a new DOM parser to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');

    // Select table rows where the data is stored in the published sheet
    const rows = doc.querySelectorAll('table tbody tr');

    rows.forEach((row, index) => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 10) return; // Skip rows with insufficient data

        const year = cells[0].innerText.trim();
        const inventions = cells[1].innerText.trim() !== 'N/A' ? `<em>Inventions:</em> ${cells[1].innerText.trim()}<br>` : '';
        const worldEvents = cells[2].innerText.trim() !== 'N/A' ? `<em>World Events:</em> ${cells[2].innerText.trim()}<br>` : '';
        const localEvents = cells[3].innerText.trim() !== 'N/A' ? `<em>Local Events:</em> ${cells[3].innerText.trim()}<br>` : '';
        const population = cells[4].innerText.trim() !== 'N/A' ? `<em>Population:</em> ${cells[4].innerText.trim()}<br>` : '';
        const density = cells[5].innerText.trim() !== 'N/A' ? `<em>Density:</em> ${cells[5].innerText.trim()}<br>` : '';
        const urbanPop = cells[6].innerText.trim() !== 'N/A' ? `<em>Urban Pop %:</em> ${cells[6].innerText.trim()}<br>` : '';
        const inflation = cells[9].innerText.trim() !== 'N/A' ? `<em>Inflation Rate:</em> ${cells[9].innerText.trim()}<br>` : '';

        // Skip creating a timeline item if all fields are empty or "N/A"
        if (!year || (!inventions && !worldEvents && !localEvents && !population && !density && !urbanPop && !inflation)) return;

        // Create the timeline item
        const item = document.createElement('div');
        item.classList.add('timeline-item');
        item.innerHTML = `<strong>${year}</strong><br>
                          ${inventions}
                          ${worldEvents}
                          ${localEvents}
                          ${population}
                          ${density}
                          ${urbanPop}
                          ${inflation}`;
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
    });
}