const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "light",
    aliases: ["lightpic", "lightquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Light Yagami picture & quote",
    longDescription: "Sends a random Light Yagami (Death Note) image along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Light image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get random image (fallback if no Light-specific API available)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Light quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=light%20yagami");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "light.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `📝 Light Yagami 📝\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Death Note`;

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
      api.sendMessage("❌ Error fetching Light content. Try again later.", event.threadID, event.messageID);
    }
  }
};
