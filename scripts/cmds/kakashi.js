const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "kakashi",
    aliases: ["kakashipic", "kakashiquote"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Random Kakashi picture & quote",
    longDescription: "Sends a random Kakashi Hatake image along with a character quote from Naruto anime.",
    category: "anime",
    guide: {
      en: "{pn} → Sends a random Kakashi image with quote"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      // 1. Get Kakashi image (using waifu.pics sfw fallback)
      const imgRes = await axios.get("https://api.waifu.pics/sfw/waifu"); 
      const imageUrl = imgRes.data.url;

      // 2. Get Kakashi quote
      const quoteRes = await axios.get("https://animechan.xyz/api/random/character?name=kakashi%20hatake");
      const quoteData = quoteRes.data;

      const filePath = path.join(__dirname, "cache", "kakashi.jpg");
      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

      const msg = `⚡ Kakashi Hatake ⚡\n\n👤 ${quoteData.character}\n💬 "${quoteData.quote}"\n\n📺 Anime: Naruto`;

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
      api.sendMessage("❌ Error fetching Kakashi content. Try again later.", event.threadID, event.messageID);
    }
  }
};
