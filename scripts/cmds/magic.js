const axios = require("axios");

module.exports = {
  config: {
    name: "magic",
    aliases: ["wizard", "predict", "fortuneteller", "mystic"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0, // 0 = everyone can use
    category: "fun",
    shortDescription: "AI magic: predictions, answers, and fun mystical responses",
    longDescription: "Ask a question or give a topic, and the AI will respond magically.",
    guide: "Usage: magic <your question or topic>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.join(" ")) {
        return api.sendMessage("❌ Please provide a question or topic for AI magic.", event.threadID);
      }

      const prompt = args.join(" ");

      // Replace this with your AI API endpoint
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: `You are a magical AI. Provide a mystical, fun, or clever answer to: ${prompt}`,
        max_tokens: 150,
        temperature: 0.9
      }, {
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const magicAnswer = response.data.choices[0].text.trim();

      api.sendMessage(`✨ AI Magic Result:\n\n${magicAnswer}`, event.threadID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while performing AI magic.", event.threadID);
    }
  }
};
