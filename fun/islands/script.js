document.addEventListener("DOMContentLoaded", () => {
    const mapFrame = document.getElementById("map");
    const newLocationButton = document.getElementById("new-location");
    let locations = [];
  
    // Fetch locations from the flat file
    fetch("locations.json")
      .then((response) => response.json())
      .then((data) => {
        locations = data;
        showRandomLocation();
      })
      .catch((error) => console.error("Error loading locations:", error));
  
    // Function to show a random location
    function showRandomLocation() {
      if (locations.length > 0) {
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        mapFrame.src = randomLocation.embed_url;
      }
    }
  
    // Button click event to show a new location
    newLocationButton.addEventListener("click", showRandomLocation);
  });