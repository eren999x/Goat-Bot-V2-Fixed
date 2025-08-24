const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "husbandogif",
    aliases: ["hgif", "husbandopic", "husbandog"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Get random husbando GIF",
    longDescription: "Fetches a random anime husbando GIF from Nekos.best API.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random husbando GIF"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const res = await axios.get("https://nekos.best/api/v2/husbando");
      const gifData = res.data.results[0];

      if (!gifData || !gifData.url) {
        return api.sendMessage("⚠️ Could not fetch husbando GIF.", event.threadID, event.messageID);
      }

      const filePath = path.join(__dirname, "cache", "husbandogif.gif");
      const response = await axios.get(gifData.url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      api.sendMessage(
        {
          body: `💙 Here’s a Husbando GIF for you!\n👤 Character: ${gifData.anime_name || "Unknown"}`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching husbando GIF. Try again later.", event.threadID, event.messageID);
    }
  }
};
