const axios = require("axios");

module.exports = {
  config: {
    name: "draw",
    aliases: ["art", "imagegen", "aiart", "createpic"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 10,
    role: 0, // 0 = everyone can use
    category: "fun",
    shortDescription: "Generate an AI drawing or image from text",
    longDescription: "Provide a description, and the AI will generate an image based on it.",
    guide: "Usage: draw <description>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.join(" ")) {
        return api.sendMessage("❌ Please provide a description for the AI to draw.", event.threadID);
      }

      const prompt = args.join(" ");

      // Replace with your AI image generation API endpoint
      const response = await axios.post("https://api.openai.com/v1/images/generations", {
        prompt: prompt,
        n: 1,
        size: "512x512"
      }, {
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const imageUrl = response.data.data[0].url;

      api.sendMessage({ body: `🎨 Here’s your AI-generated image for: "${prompt}"`, attachment: await global.utils.getStream(imageUrl) }, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while generating the image.", event.threadID);
    }
  }
};
