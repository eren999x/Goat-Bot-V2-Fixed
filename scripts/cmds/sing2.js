const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sing2",
    aliases: ["song", "tts", "singai", "voicegen"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 10,
    role: 0, // 0 = everyone can use
    category: "fun",
    shortDescription: "Generate AI singing or TTS audio from text",
    longDescription: "Send a text, and the AI will sing it or convert it into a voice audio.",
    guide: "Usage: sing <lyrics or text>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.join(" ")) {
        return api.sendMessage("❌ Please provide lyrics or text for the AI to sing.", event.threadID);
      }

      const text = args.join(" ");

      // Replace this with your AI TTS or singing API endpoint
      const response = await axios.post("https://api.openai.com/v1/audio/speech", {
        model: "gpt-4o-mini-tts", // example TTS model
        voice: "alloy",
        input: text
      }, {
        responseType: "arraybuffer",
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const filePath = path.join(__dirname, `sing_${Date.now()}.mp3`);
      fs.writeFileSync(filePath, Buffer.from(response.data));

      api.sendMessage({ body: `🎵 Here’s your AI-generated singing:`, attachment: fs.createReadStream(filePath) }, event.threadID, () => {
        fs.unlinkSync(filePath); // Delete file after sending
      });

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while generating the singing/audio.", event.threadID);
    }
  }
};
