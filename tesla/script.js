document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch data from the Make.com webhook
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
                document.getElementById('outside_tempF').textContent = `${data.outside_tempF} °F`;
                document.getElementById('inside_tempF').textContent = `${data.inside_tempF} °F`;
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Fetch data when the page loads
    fetchData();
});