const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "goku",
    aliases: ["gokupic", "gokuquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Son Goku picture & quote",
    longDescription: "Sends a random Son Goku (Dragon Ball) image along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Goku image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get random image (using fallback, can be swapped with Goku-specific gallery)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Goku quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=goku");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "goku.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `💥 Son Goku 💥\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Dragon Ball`;

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
      api.sendMessage("❌ Error fetching Goku content. Try again later.", event.threadID, event.messageID);
    }
  }
};
