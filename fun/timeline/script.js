// Configuration
const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRGfo5oxrOUKeb0mOilUhAO5DqZCvXmQwvkpAcoBqAPC0kOutgAQ23Cx_rm2WJeQQ8rosO1f_QyyhCP/pub?gid=0&single=true&output=csv';

// Fetch CSV data from Google Sheets
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error fetching the Google Sheet:', error);
        return [];
    }
}

// Parse CSV to JSON
function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1);
    const result = rows.map(row => {
        const values = row.split(',').map(value => value.trim());
        let obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        return obj;
    });
    return result;
}

// Render Timeline
function renderTimeline(data) {
    const timeline = document.getElementById('timeline');

    // Sort data by Year (assuming numerical)
    data.sort((a, b) => {
        const yearA = parseInt(a['Year'], 10);
        const yearB = parseInt(b['Year'], 10);
        return yearA - yearB;
    });

    data.forEach(item => {
        const year = item['Year'];
        const event = item['Event'];

        if (year && event) { // Only display if both Year and Event are present
            const yearDot = document.createElement('div');
            yearDot.className = 'year-dot';
            yearDot.dataset.event = event;

            const dot = document.createElement('div');
            dot.className = 'dot';

            const label = document.createElement('div');
            label.className = 'year-label';
            label.textContent = year;

            yearDot.appendChild(dot);
            yearDot.appendChild(label);
            timeline.appendChild(yearDot);
        }
    });
}

// Tooltip Handling
function handleTooltip() {
    const tooltip = document.getElementById('tooltip');
    const tooltipContent = document.getElementById('tooltip-content');

    document.querySelectorAll('.year-dot').forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const content = dot.dataset.event;
            if (content) {
                tooltipContent.textContent = content;
                tooltip.classList.remove('hidden');
                tooltip.classList.add('visible');
            }
        });

        dot.addEventListener('mousemove', (e) => {
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
            let left = e.clientX + 20;
            let top = e.clientY - tooltipHeight - 20;

            // Prevent tooltip from going off the right edge
            if (left + tooltipWidth > window.innerWidth) {
                left = window.innerWidth - tooltipWidth - 10;
            }

            // Prevent tooltip from going above the viewport
            if (top < 0) {
                top = e.clientY + 20;
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        });

        dot.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            tooltip.classList.add('hidden');
        });
    });
}

// Zoom and Scroll Functionality
let scale = 1;
const timelineContainer = document.getElementById('timeline-container');
const timelineElement = document.getElementById('timeline');

function zoomTimeline(delta) {
    scale += delta;
    scale = Math.min(Math.max(scale, 0.5), 3); // Limit zoom between 0.5x and 3x
    timelineElement.style.transform = `translateY(-50%) scale(${scale})`;
}

function scrollTimeline(direction) {
    const scrollAmount = 100 * scale;
    timelineContainer.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

function handleKeyboardEvents() {
    window.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'PageDown':
                e.preventDefault();
                scrollTimeline(1); // Scroll right (future)
                break;
            case 'PageUp':
                e.preventDefault();
                scrollTimeline(-1); // Scroll left (past)
                break;
            case '+':
            case '=':
                e.preventDefault();
                zoomTimeline(0.1);
                break;
            case '-':
                e.preventDefault();
                zoomTimeline(-0.1);
                break;
            default:
                break;
        }
    });
}

function handleMouseWheel() {
    timelineContainer.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomTimeline(0.1);
            } else {
                zoomTimeline(-0.1);
            }
        } else {
            // Horizontal scroll
            timelineContainer.scrollBy({
                left: e.deltaY,
                behavior: 'smooth'
            });
        }
    }, { passive: false });
}

// Initialize Timeline
async function init() {
    const data = await fetchData(sheetURL);
    if (data.length === 0) {
        console.error('No data available to render the timeline.');
        return;
    }
    renderTimeline(data);
    handleTooltip();
    handleKeyboardEvents();
    handleMouseWheel();
}

// Ensure the DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', init);