document.addEventListener('DOMContentLoaded', function() {
    const RATE_LIMIT_INTERVAL = 10000; // 1 minute in milliseconds
    const LAST_FETCH_KEY = 'lastFetchTime';

    function shouldFetchData() {
        const lastFetchTime = localStorage.getItem(LAST_FETCH_KEY);
        const currentTime = Date.now();
        if (!lastFetchTime || currentTime - lastFetchTime > RATE_LIMIT_INTERVAL) {
            localStorage.setItem(LAST_FETCH_KEY, currentTime);
            return true;
        }
        return false;
    }

    function fetchData() {
        if (!shouldFetchData()) {
            console.log('Fetch skipped to respect rate limit.');
            return;
        }

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
                document.getElementById('tempF').textContent = `Inside: ${data.inside_tempF} °F | Outside: ${data.outside_tempF} °F`;
                updateBatteryLevel(data.battery_level);
            })
            .catch(error => console.error('Error fetching data:', error));
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