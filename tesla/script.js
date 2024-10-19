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
                console.log('Data received:', data);

                // Update the page with the received data
                const displayNameElement = document.getElementById('display_name');
                console.log('displayNameElement:', displayNameElement);
                displayNameElement.textContent = data.display_name;

                const tempFElement = document.getElementById('tempF');
                console.log('tempFElement:', tempFElement);
                tempFElement.textContent = `Inside: ${data.inside_tempF} °F | Outside: ${data.outside_tempF} °F`;

                updateBatteryLevel(data.battery_level);

                // Update the last updated time
                const currentTime = new Date();
                const lastUpdatedElement = document.getElementById('last_updated');
                console.log('lastUpdatedElement:', lastUpdatedElement);
                lastUpdatedElement.textContent = `Last Updated: ${currentTime.toLocaleTimeString()}`;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateBatteryLevel(batteryLevel) {
        console.log('Updating battery level:', batteryLevel);
        const circle = document.querySelector('.battery-ring circle');
        console.log('circle:', circle);

        if (circle) {
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
        } else {
            console.error('Circle element not found');
        }

        const batteryLevelElement = document.getElementById('battery_level');
        console.log('batteryLevelElement:', batteryLevelElement);
        batteryLevelElement.textContent = `${batteryLevel}%`;
    }

    // Fetch data when the page loads
    fetchData();
});