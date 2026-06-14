// URL of the Google Sheet's published CSV.
const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRbtuzLo29gaOYk7AYUM-DTnStDT-hpmsWz_0yHZeDVoHVzTaMeBpixNiZrxRNKVM_83C0pJ2eqPHqK/pub?gid=0&single=true&output=csv';

function parseCsv(csvText) {
    const rows = [];
    let currentCell = '';
    let currentRow = [];
    let insideQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"' && nextChar === '"') {
            currentCell += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\n' || char === '\r') && !insideQuotes) {
            if (char === '\r' && nextChar === '\n') {
                i++;
            }

            currentRow.push(currentCell.trim());
            if (currentRow.some(Boolean)) {
                rows.push(currentRow);
            }
            currentCell = '';
            currentRow = [];
        } else {
            currentCell += char;
        }
    }

    currentRow.push(currentCell.trim());
    if (currentRow.some(Boolean)) {
        rows.push(currentRow);
    }

    return rows;
}

async function fetchGoogleSheetData() {
    const dynamicText = document.getElementById('dynamic-text');

    try {
        const response = await fetch(googleSheetUrl);
        if (!response.ok) {
            throw new Error(`Google Sheet request failed: ${response.status}`);
        }

        const csv = await response.text();
        const rows = parseCsv(csv).slice(1);
        const lastRow = rows.reverse().find(row => row[0] && row[1] && row[2]);

        if (!lastRow) {
            throw new Error('No check-in rows found');
        }

        const date = lastRow[0];
        const location = lastRow[1];
        const placeName = lastRow[2];

        dynamicText.textContent = `On ${date} in ${location} at ${placeName}`;
        dynamicText.style.display = 'block';
    } catch (error) {
        console.error('Error fetching Google Sheet data:', error);
        dynamicText.textContent = 'Location unavailable';
        dynamicText.style.display = 'block';
    }
}

// Fetch the Google Sheet data when the page loads
document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);
