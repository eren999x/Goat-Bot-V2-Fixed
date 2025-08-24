const axios = require("axios");

module.exports = {
  config: {
    name: "think",
    aliases: ["idea", "brainstorm", "ponder"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 1, // 0 = everyone can use
    category: "fun",
    shortDescription: "AI thinks about a topic and gives ideas or advice",
    longDescription: "Send a topic, and the AI will 'think' and give you suggestions, ideas, or opinions.",
    guide: "Usage: think <topic>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.join(" ")) {
        return api.sendMessage("❌ Please provide a topic for the AI to think about.", event.threadID);
      }

      const topic = args.join(" ");

      // Replace this with your AI API endpoint
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: `Think deeply about the following topic and give creative ideas, insights, or advice: ${topic}`,
        max_tokens: 150,
        temperature: 0.8
      }, {
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const idea = response.data.choices[0].text.trim();

      api.sendMessage(`🤔 AI Thinking Result for "${topic}":\n\n${idea}`, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while thinking about the topic.", event.threadID);
    }
  }
};
