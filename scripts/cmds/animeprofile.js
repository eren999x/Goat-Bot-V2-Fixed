const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "animeprofile",
    aliases: ["aprofile", "animechar", "character"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Get random anime character profile",
    longDescription: "Fetches a random anime character profile with name, anime, about info, and picture.",
    category: "anime",
    guide: {
      en: "{pn} → Get a random anime character profile\n{pn} <name> → Search for a character by name"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      let query = args.join(" ");
      let url = "";

      if (query) {
        // Search character by name
        url = `https://api.jikan.moe/v4/characters?q=${encodeURIComponent(query)}&limit=1`;
      } else {
        // Get random character
        url = "https://api.jikan.moe/v4/random/characters";
      }

      const res = await axios.get(url);
      const data = res.data.data;

      if (!data) {
        return api.sendMessage("⚠️ No character found.", event.threadID, event.messageID);
      }

      // If search → array, if random → object
      const character = Array.isArray(data) ? data[0] : data;

      const name = character.name || "Unknown";
      const kanji = character.name_kanji || "";
      const about = character.about ? character.about.replace(/\n/g, " ").slice(0, 500) + "..." : "No description.";
      const anime = character.anime ? character.anime[0]?.anime?.title : "N/A";
      const img = character.images?.jpg?.image_url;

      let msg = `✨ Anime Character Profile ✨\n\n👤 Name: ${name} ${kanji}\n📺 Anime: ${anime}\n📝 About: ${about}`;

      if (img) {
        const filePath = path.join(__dirname, "cache", "aprofile.jpg");
        const image = await axios.get(img, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(image.data, "binary"));

        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      } else {
        api.sendMessage(msg, event.threadID, event.messageID);
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching anime profile. Try again later.", event.threadID, event.messageID);
    }
  }
};
