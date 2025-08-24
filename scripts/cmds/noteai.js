const axios = require("axios");

module.exports = {
  config: {
    name: "noteai",
    aliases: ["note", "notegen", "aicreate"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0, // 0 = everyone can use
    category: "utility",
    shortDescription: "Generate AI notes or summaries",
    longDescription: "Send a prompt, and the AI will generate a note or summary for you.",
    guide: "Usage: noteai <your text or topic>"
  },

  run: async ({ api, event, args }) => {
    try {
      if (!args.join(" ")) {
        return api.sendMessage("❌ Please provide some text or topic to generate a note.", event.threadID);
      }

      const prompt = args.join(" ");

      // Replace this URL with your AI API endpoint
      const response = await axios.post("https://api.openai.com/v1/completions", {
        model: "text-davinci-003",
        prompt: `Create a concise note or summary about: ${prompt}`,
        max_tokens: 150,
        temperature: 0.7
      }, {
        headers: {
          "Authorization": `Bearer YOUR_OPENAI_API_KEY`,
          "Content-Type": "application/json"
        }
      });

      const note = response.data.choices[0].text.trim();

      api.sendMessage(`📝 Here’s your AI-generated note:\n\n${note}`, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Something went wrong while generating the note.", event.threadID);
    }
  }
};
