// Configuration
const sheetURL = 'timeline.csv'; // Local CSV file in the root directory

// Fetch CSV data from the local timeline.csv file
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error fetching the CSV file:', error);
        return [];
    }
}

// Parse CSV to JSON with multi-row headers
function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) {
        console.error('CSV does not have enough header rows.');
        return [];
    }

    // Parse the first two rows as headers
    const categoryHeaders = parseCSVRow(lines[0]);
    const subcategoryHeaders = parseCSVRow(lines[1]);

    // Combine headers to create a mapping of column index to { category, subcategory }
    const headers = [];
    for (let i = 0; i < subcategoryHeaders.length; i++) {
        const category = categoryHeaders[i] ? categoryHeaders[i].trim() : '';
        const subcategory = subcategoryHeaders[i] ? subcategoryHeaders[i].trim() : '';
        headers.push({
            category: category,
            subcategory: subcategory
        });
    }

    const dataRows = lines.slice(2);
    const result = dataRows.map(row => {
        const values = parseCSVRow(row);
        let obj = {};
        headers.forEach((header, index) => {
            obj[index] = {
                category: header.category,
                subcategory: header.subcategory,
                value: values[index] || ''
            };
        });
        return obj;
    });

    return { headers, data: result };
}

// Function to correctly parse a single CSV row, handling quoted fields with commas
function parseCSVRow(row) {
    const regex = /("([^"]|"")*"|[^,]*)/g;
    const values = [];
    let match;
    while ((match = regex.exec(row)) !== null) {
        let value = match[1].trim();
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"');
        }
        values.push(value);
    }
    return values;
}

// Render Timeline
function renderTimeline(parsedData) {
    const timeline = document.getElementById('timeline');
    const { headers, data } = parsedData;

    data.forEach(row => {
        const yearEntry = row[0]; // Assuming the first column is 'Year'
        const year = yearEntry.value;

        if (!year) {
            // Skip rows without a year
            return;
        }

        // Collect all events for this year
        const events = [];
        for (let i = 1; i < headers.length; i++) { // Start from 1 to skip 'Year'
            const cell = row[i];
            if (cell.value) {
                events.push({
                    category: cell.category,
                    subcategory: cell.subcategory,
                    value: cell.value
                });
            }
        }

        if (events.length === 0) {
            // If there are no events for this year, skip rendering
            return;
        }

        // Create the year dot element
        const yearDot = document.createElement('div');
        yearDot.className = 'year-dot';
        yearDot.dataset.events = JSON.stringify(events); // Store events as JSON string

        const dot = document.createElement('div');
        dot.className = 'dot';

        const label = document.createElement('div');
        label.className = 'year-label';
        label.textContent = year;

        yearDot.appendChild(dot);
        yearDot.appendChild(label);
        timeline.appendChild(yearDot);
    });
}

// Tooltip Handling
function handleTooltip() {
    const tooltip = document.getElementById('tooltip');
    const tooltipContent = document.getElementById('tooltip-content');

    document.querySelectorAll('.year-dot').forEach(dot => {
        dot.addEventListener('mouseenter', (e) => {
            const events = JSON.parse(dot.dataset.events);
            if (events && events.length > 0) {
                // Group events by category
                const groupedEvents = {};
                events.forEach(event => {
                    const category = event.category || 'Other Events';
                    if (!groupedEvents[category]) {
                        groupedEvents[category] = [];
                    }
                    groupedEvents[category].push(event.subcategory || event.value);
                });

                // Build HTML content
                let contentHTML = '';
                for (const [category, subevents] of Object.entries(groupedEvents)) {
                    contentHTML += `<h3>${category}</h3><ul>`;
                    subevents.forEach(se => {
                        contentHTML += `<li>${se}</li>`;
                    });
                    contentHTML += `</ul>`;
                }

                tooltipContent.innerHTML = contentHTML;
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
    const parsedData = await fetchData(sheetURL);
    if (!parsedData || parsedData.data.length === 0) {
        console.error('No data available to render the timeline.');
        return;
    }
    renderTimeline(parsedData);
    handleTooltip();
    handleKeyboardEvents();
    handleMouseWheel();
}

// Ensure the DOM is loaded before initializing
document.addEventListener('DOMContentLoaded', init);