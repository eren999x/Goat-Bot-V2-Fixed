const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sasuke",
    aliases: ["sasukepic", "sasukequote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Sasuke picture & quote",
    longDescription: "Sends a random Sasuke Uchiha image along with a character quote from Naruto anime.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Sasuke image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get Sasuke image (Pinterest/waifu fallback)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/neko"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Sasuke quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=sasuke%20uchiha");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "sasuke.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `🌌 Sasuke Uchiha 🌌\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Naruto`;

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
      api.sendMessage("❌ Error fetching Sasuke content. Try again later.", event.threadID, event.messageID);
    }
  }
};
