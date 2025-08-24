const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "animevoice",
    aliases: ["avoice", "animeva", "seiyuu"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Get random anime voice line",
    longDescription: "Plays a random anime character voice line (Japanese). Useful for fun & anime fans.",
    category: "anime",
    guide: {
      en: "{pn} → Get a random anime voice line"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // Example random anime voice API (replace if you have better source)
      const res = await axios.get("https://animevoice.vercel.app/api/random");
      const voice = res.data;

      if (!voice || !voice.url) {
        return api.sendMessage("⚠️ Could not fetch anime voice.", event.threadID, event.messageID);
      }

      const filePath = path.join(__dirname, "cache", "animevoice.mp3");
      const response = await axios.get(voice.url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `🎤 Anime Voice Line\n👤 Character: ${voice.character || "Unknown"}\n📺 Anime: ${voice.anime || "Unknown"}`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching anime voice. Try again later.", event.threadID, event.messageID);
    }
  }
};
