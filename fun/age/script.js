// List of dates from the provided data (Column C from the screenshot)
const eventDates = [
    '07/20/1974',  // Born
    '07/20/1992',  // Age 18
    '06/01/1992',  // High School Grad
    '04/22/1997',  // Since Thailand
    '12/07/2008',  // Married
    '01/03/2009',  // Since BTC
    '04/29/2009',  // First child
    '03/13/2013',  // Second child
    '06/15/2021',  // USA move
    '01/01/2030',  // Til 2030
    '06/01/2031',  // Til Caius Grad
    '07/20/2034',  // Til Retire at 60
    '08/25/2057'   // Til Death 83
];

// Helper function to calculate the years and days difference between two dates
function calculateYearsAndDays(startDate) {
    const currentDate = new Date();
    const start = new Date(startDate);
    
    // Calculate the full years difference
    let years = currentDate.getFullYear() - start.getFullYear();
    
    // Calculate the days difference within the current year
    let startThisYear = new Date(currentDate.getFullYear(), start.getMonth(), start.getDate());
    let diffTime = Math.abs(currentDate - startThisYear);
    let days = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    // If the start date is later this year, reduce years by 1
    if (currentDate < startThisYear) {
        years--;
        startThisYear = new Date(currentDate.getFullYear() - 1, start.getMonth(), start.getDate());
        diffTime = Math.abs(currentDate - startThisYear);
        days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    return { years, days };
}

// List of descriptors from Column A
const eventDescriptions = [
    'Since Born', 
    'Since Age 18', 
    'High School Graduation', 
    'Since Thailand Move', 
    'Since Married', 
    'Since BTC Started', 
    'First child', 
    'Second child', 
    'Since USA move', 
    'Til 2030', 
    'Til Caius Grad', 
    'Til Retire at 60', 
    'Til Death 83'
];

// Function to update all clocks on the dashboard
function updateClocks() {
    eventDates.forEach((date, index) => {
        const { years, days } = calculateYearsAndDays(date);
        const clockElement = document.getElementById(`count${index + 1}`);
        const descriptorElement = clockElement.nextElementSibling;

        // Update the clock with years and days, wrapping "years" and "days" separately
        clockElement.innerHTML = `
            <span class="number">${years}</span> <span class="unit">years</span>, 
            <span class="number">${days}</span> <span class="unit">days</span>
        `;

        // Update the descriptor text
        descriptorElement.textContent = eventDescriptions[index];
    });
}

// Initialize the clocks when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateClocks();
    setInterval(updateClocks, 86400000); // Update every 24 hours
});