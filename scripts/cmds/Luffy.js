const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "luffy",
    aliases: ["luffypic", "luffyquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Luffy picture & quote",
    longDescription: "Sends a random Monkey D. Luffy (One Piece) image along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Luffy image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get random image (fallback if no Luffy-specific API available)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Luffy quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=monkey%20d.%20luffy");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "luffy.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `🏴‍☠️ Monkey D. Luffy 🏴‍☠️\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: One Piece`;

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
      api.sendMessage("❌ Error fetching Luffy content. Try again later.", event.threadID, event.messageID);
    }
  }
};
