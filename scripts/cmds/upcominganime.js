const axios = require("axios");

module.exports = {
  config: {
    name: "upcominganime",
    aliases: ["upanime", "nextanime", "animeupcoming"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Shows upcoming anime list",
    longDescription: "Fetches a list of upcoming anime from MyAnimeList via Jikan API.",
    category: "anime",
    guide: {
      en: "{pn} → Shows upcoming anime releases"
    }
  },

  onStart: async function ({ api, event }) {
    try {
      const res = await axios.get("https://api.jikan.moe/v4/seasons/upcoming?limit=10");
      const data = res.data.data;

      if (!data || data.length === 0) {
        return api.sendMessage("⚠️ No upcoming anime found.", event.threadID, event.messageID);
      }

      let msg = "📢 Upcoming Anime Releases 📢\n\n";
      data.forEach((anime, index) => {
        msg += `🎬 ${index + 1}. ${anime.title}\n📅 Year: ${anime.year || "N/A"}\n🔗 ${anime.url}\n\n`;
      });

      api.sendMessage(msg.trim(), event.threadID, event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Error fetching upcoming anime. Try again later.", event.threadID, event.messageID);
    }
  }
};
