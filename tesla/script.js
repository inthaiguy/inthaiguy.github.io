document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch data
    function fetchData() {
        // Send a ping to the specified URL
        fetch('https://hook.us1.make.com/y4jcfyeaodrzlnv73fpcthv03kw6o6aj')
            .then(response => response.json())
            .then(data => {
                // Update the page with the received data
                document.getElementById('display_name').textContent = data.display_name;
                document.getElementById('outside_tempF').textContent = `${data.outside_tempF} °F`;
                document.getElementById('inside_tempF').textContent = `${data.inside_tempF} °F`;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Fetch data when the page loads
    fetchData();
});