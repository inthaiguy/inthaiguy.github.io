document.addEventListener("DOMContentLoaded", () => {
  const soundboard = document.getElementById("soundboard");
  const soundsPath = "./sounds/";

  fetch("/.netlify/functions/list-sounds")
    .then(response => response.json())
    .then(soundFiles => {
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
    .catch(error => {
      console.error("Error fetching sound files:", error);
      soundboard.innerHTML = "<p>Unable to load sounds</p>";
    });
});