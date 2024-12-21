document.addEventListener("DOMContentLoaded", () => {
    const soundboard = document.getElementById("soundboard");
  // Base URL for the sounds folder on GitHub Pages
   const soundsPath = "https://inthaiguy.github.io/fun/soundboard/sounds/";
    
    // Fetch sound files from the sounds directory
    fetch(soundsPath)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, 'text/html');
        const soundFiles = Array.from(htmlDoc.querySelectorAll("a"))
          .map(link => link.getAttribute("href"))
          .filter(file => file.endsWith(".mp3"));
  
        if (soundFiles.length === 0) {
          soundboard.innerHTML = "<p>No sounds available</p>";
          return;
        }
  
        soundFiles.forEach(fileName => {
          const formattedName = fileName.replace(/_/g, " ").replace(".mp3", "");
          const button = document.createElement("button");
          button.textContent = formattedName;
  
          const audio = new Audio(`${soundsPath}${fileName}`);
          button.addEventListener("click", () => {
            audio.currentTime = 0; // Restart sound
            audio.play();
          });
  
          soundboard.appendChild(button);
        });
      })
      .catch(error => console.error("Error loading sounds:", error));
  });