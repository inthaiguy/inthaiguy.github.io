// URL of the Google Sheet's published HTML page
const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRbtuzLo29gaOYk7AYUM-DTnStDT-hpmsWz_0yHZeDVoHVzTaMeBpixNiZrxRNKVM_83C0pJ2eqPHqK/pubhtml?gid=0&single=true';

// Function to fetch the Google Sheet HTML content
function fetchGoogleSheetData() {
    fetch(googleSheetUrl)
        .then(response => response.text())
        .then(html => {
            // Create a new DOMParser to parse the HTML content
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Select the last row in the table (assuming it's the last event)
            const tableRows = doc.querySelectorAll('table tbody tr');
            const lastRow = tableRows[tableRows.length - 1];

            // Extract the date, location, and place from the last row's cells
            const date = lastRow.cells[0].innerText.trim();       // Assuming Date is in the first cell
            const location = lastRow.cells[1].innerText.trim();   // Assuming Location is in the second cell
            const placeName = lastRow.cells[2].innerText.trim();  // Assuming Place Name is in the third cell

            // Format the text and display it in the h2 tag
            const dynamicText = document.getElementById('dynamic-text');
            dynamicText.textContent = `On ${date} in ${location} at ${placeName}`;
        })
        .catch(error => {
            console.error('Error fetching Google Sheet data:', error);
        });
}

// Fetch the Google Sheet data when the page loads
document.addEventListener('DOMContentLoaded', fetchGoogleSheetData);