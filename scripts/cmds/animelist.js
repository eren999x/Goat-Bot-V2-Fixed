const axios = require("axios");

module.exports = {
  config: {
    name: "animelist",
    aliases: ["alist", "animechart", "animeup"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Shows top/upcoming anime list",
    longDescription: "Fetches anime list from MyAnimeList (via Jikan API). You can get top anime, upcoming anime, or seasonal releases.",
    category: "anime",
    guide: {
      en: "{pn} top\n{pn} upcoming\n{pn} season"
    }
  },

  onStart: async function ({ api, event, args }) {
    let type = args[0] || "top"; // default = top anime
    let url = "";

    if (type === "top") {
      url = "https://api.jikan.moe/v4/top/anime?limit=10";
    } else if (type === "upcoming") {
      url = "https://api.jikan.moe/v4/seasons/upcoming?limit=10";
    } else if (type === "season") {
      url = "https://api.jikan.moe/v4/seasons/now?limit=10";
    } else {
      return api.sendMessage(
        "❌ Invalid option!\nUse:\n- animelist top\n- animelist upcoming\n- animelist season",
        event.threadID,
        event.messageID
      );
    }

    try {
      const res = await axios.get(url);
      const data = res.data.data;

      if (!data || data.length === 0) {
        return api.sendMessage("⚠️ No anime found.", event.threadID, event.messageID);
      }

      let msg = "";
      data.forEach((anime, index) => {
        msg += `🎬 ${index + 1}. ${anime.title}\n📊 Score: ${anime.score || "N/A"}\n📅 Year: ${anime.year || "N/A"}\n🔗 ${anime.url}\n\n`;
      });

      api.sendMessage(msg.trim(), event.threadID, event.messageID);
    } catch (e) {
      api.sendMessage("❌ Error fetching anime list. Try again later.", event.threadID, event.messageID);
      console.error(e);
    }
  }
};
