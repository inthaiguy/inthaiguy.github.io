document.addEventListener('DOMContentLoaded', function() {

    function fetchData() {
        fetch('https://hook.us1.make.com/y4jcfyeaodrzlnv73fpcthv03kw6o6aj')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update the page with the received data
            document.getElementById('display_name').textContent = data.display_name;
            updateTemperatureScales(data.inside_tempF, data.outside_tempF);
            updateBatteryLevel(data.battery_level);

            // Update the last updated time
            const currentTime = new Date();
            document.getElementById('last_updated').textContent = `Last Updated: ${currentTime.toLocaleTimeString()}`;
        })
        .catch(error => console.error('Error fetching data:', error));
}

    function updateTemperatureScales(insideTemp, outsideTemp) {
        // Temperature range
        const minTemp = 0; // Minimum temperature in Fahrenheit
        const maxTemp = 100; // Maximum temperature in Fahrenheit
        const svgWidth = 300; // Width of the SVG

        // Update inside temperature scale
        const insideTempX = ((insideTemp - minTemp) / (maxTemp - minTemp)) * svgWidth;
        const insideTempLine = document.getElementById('insideTempLine');
        insideTempLine.setAttribute('x1', insideTempX);
        insideTempLine.setAttribute('x2', insideTempX);
        document.getElementById('inside_tempF').textContent = insideTemp;

        // Update outside temperature scale
        const outsideTempX = ((outsideTemp - minTemp) / (maxTemp - minTemp)) * svgWidth;
        const outsideTempLine = document.getElementById('outsideTempLine');
        outsideTempLine.setAttribute('x1', outsideTempX);
        outsideTempLine.setAttribute('x2', outsideTempX);
        document.getElementById('outside_tempF').textContent = outsideTemp;
    }

    function updateBatteryLevel(batteryLevel) {
        const circle = document.querySelector('.battery-ring circle');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (batteryLevel / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;

        // Change circle color based on battery level
        if (batteryLevel > 50) {
            circle.style.stroke = '#00b050'; // Green
        } else if (batteryLevel > 20) {
            circle.style.stroke = '#ffc000'; // Orange
        } else {
            circle.style.stroke = '#ff0000'; // Red
        }

        document.getElementById('battery_level').textContent = `${batteryLevel}%`;
    }

    // Fetch data when the page loads
    fetchData();
});