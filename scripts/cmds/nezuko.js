const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nezuko",
    aliases: ["nezukopic", "nezukoquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Nezuko Kamado picture & quote",
    longDescription: "Sends a random Nezuko Kamado (Demon Slayer) image along with a character quote.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Nezuko image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get random image (fallback if no Nezuko-specific API available)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Nezuko quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=nezuko%20kamado");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "nezuko.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `🌸 Nezuko Kamado 🌸\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Demon Slayer`;

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
      api.sendMessage("❌ Error fetching Nezuko content. Try again later.", event.threadID, event.messageID);
    }
  }
};
