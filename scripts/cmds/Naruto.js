const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "naruto",
    aliases: ["narutopic", "narutoquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Naruto picture or quote",
    longDescription: "Sends a random Naruto anime picture along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Naruto image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get Naruto image (from Pinterest-like API)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); // fallback if Naruto-specific not found
      const imageUrl = imgRes.data.url;

      // 2. Get Naruto quotes
      const quoteRes = await axios.get("https://animechan.xyz/api/random/anime?title=naruto");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "naruto.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `🍥 Naruto Quote 🍥\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Naruto`;

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
      api.sendMessage("❌ Error fetching Naruto content. Try again later.", event.threadID, event.messageID);
    }
  }
};
