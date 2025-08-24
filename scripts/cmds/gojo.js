const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "gojo",
    aliases: ["gojopic", "gojoquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Satoru Gojo picture & quote",
    longDescription: "Sends a random Satoru Gojo (Jujutsu Kaisen) image along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Gojo image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get random image (fallback if no Gojo-specific API available)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Gojo quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=satoru%20gojo");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "gojo.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `💫 Satoru Gojo 💫\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Jujutsu Kaisen`;

      api.sendMessage(
        {
          body: msg,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching Gojo content. Try again later.", event.threadID, event.messageID);
    }
  }
};
