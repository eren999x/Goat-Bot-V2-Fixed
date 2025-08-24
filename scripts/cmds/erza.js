const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "erza",
    aliases: ["erzapic", "erzaquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Erza Scarlet picture & quote",
    longDescription: "Sends a random Erza Scarlet (Fairy Tail) image along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Erza image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get random image (fallback if no Erza-specific API available)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Erza quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=erza%20scarlet");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "erza.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `🔥 Erza Scarlet 🔥\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Fairy Tail`;

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
      api.sendMessage("❌ Error fetching Erza content. Try again later.", event.threadID, event.messageID);
    }
  }
};
