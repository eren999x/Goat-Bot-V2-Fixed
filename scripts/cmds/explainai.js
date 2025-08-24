const axios = require("axios");

module.exports = {
  config: {
    name: "explainai",
    aliases: ["explain", "clarify", "teachai", "aihelp"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0, // 0 = everyone can use
    category: "utility",
    shortDescription: "Explain any topic in simple terms using AI",
    longDescription: "Provide a question or topic, and the AI will give a detailed explanation.",
    guide: "Usage: explainai <topic or question>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.join(" ")) {
        return api.sendMessage("❌ Please provide a topic or question for the AI to explain.", event.threadID);
      }

      const topic = args.join(" ");

      // Replace this with your AI API endpoint
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: `Explain in simple terms the following topic or question: ${topic}`,
        max_tokens: 250,
        temperature: 0.7
      }, {
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const explanation = response.data.choices[0].text.trim();

      api.sendMessage(`📘 Explanation for "${topic}":\n\n${explanation}`, event.threadID);

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while explaining the topic.", event.threadID);
    }
  }
};
