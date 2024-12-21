const fs = require("fs");
const path = require("path");

exports.handler = async () => {
  const soundsDir = path.join(__dirname, "../../sounds/");
  try {
    const files = fs.readdirSync(soundsDir);
    const soundFiles = files.filter(file => file.endsWith(".mp3"));
    return {
      statusCode: 200,
      body: JSON.stringify(soundFiles),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to list sound files" }),
    };
  }
};