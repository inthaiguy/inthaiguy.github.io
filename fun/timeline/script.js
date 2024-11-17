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