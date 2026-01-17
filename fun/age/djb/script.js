// DJB - Birthday: April 28, 2009
const eventDates = [
    '04/28/2009',  // Born
    '06/13/2021',  // Moved to USA
    '04/28/2027',  // Age 18
    '06/15/2027',  // High School Graduation
    '04/28/2030',  // Age 21
    '04/28/2039',  // Age 30
    '04/28/2059',  // Age 50
    '01/01/2100',  // Year 2100
    '04/28/2099'   // Age 90
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
    let days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If the start date is later this year, reduce years by 1
    if (currentDate < startThisYear) {
        years--;
        startThisYear = new Date(currentDate.getFullYear() - 1, start.getMonth(), start.getDate());
        diffTime = Math.abs(currentDate - startThisYear);
        days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    return { years, days };
}

const eventDescriptions = [
    'Since Born',
    'Since USA Move',
    'Til Age 18',
    'Til HS Graduation',
    'Til Age 21',
    'Til Age 30',
    'Til Age 50',
    'Til Year 2100',
    'Til Age 90'
];

// Function to update all clocks on the dashboard
function updateClocks() {
    eventDates.forEach((date, index) => {
        const { years, days } = calculateYearsAndDays(date);
        const clockElement = document.getElementById(`count${index + 1}`);
        const descriptorElement = clockElement.nextElementSibling;

        // Update the clock with years and days, with labels underneath
        clockElement.innerHTML = `
            <div class="time-unit">
                <span class="number">${years}</span>
                <span class="unit">years</span>
            </div>
            <div class="time-unit">
                <span class="number">${days}</span>
                <span class="unit">days</span>
            </div>
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
