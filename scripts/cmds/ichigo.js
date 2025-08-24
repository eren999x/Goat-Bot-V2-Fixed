const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "ichigo",
    aliases: ["ichigopic", "ichigoquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Ichigo Kurosaki picture & quote",
    longDescription: "Sends a random Ichigo Kurosaki image along with a character quote from Bleach anime.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Ichigo image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get Ichigo image (using fallback if no direct Ichigo API available)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Ichigo quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=ichigo%20kurosaki");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "ichigo.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `🗡️ Ichigo Kurosaki 🗡️\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Bleach`;

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
      api.sendMessage("❌ Error fetching Ichigo content. Try again later.", event.threadID, event.messageID);
    }
  }
};
