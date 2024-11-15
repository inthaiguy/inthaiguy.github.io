document.addEventListener('DOMContentLoaded', function () {
    const timeline = document.getElementById('timeline');
    let zoomLevel = 1; // Initial zoom level (1x)

    // Sample data (replace with actual data loading from CSV file)
    const events = [
        { year: 2023, description: 'Israel war, Queen Elizabeth died, Ukraine war' },
        { year: 2022, description: 'Another event' },
        { year: 2019, description: 'A major event' },
        // Add more events as needed
    ];

    // Create timeline items
    events.forEach(event => {
        const item = document.createElement('div');
        item.classList.add('timeline-item');
        item.innerHTML = `<strong>${event.year}</strong><br>${event.description}`;
        timeline.appendChild(item);
    });

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
});