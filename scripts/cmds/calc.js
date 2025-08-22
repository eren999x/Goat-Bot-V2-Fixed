const math = require("mathjs");

module.exports = {
  config: {
    name: "calc",
    aliases: ["calculate", "math"],
    version: "1.1",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    shortDescription: "Quick calculator",
    longDescription: "Perform basic and advanced math calculations easily.",
    category: "utility",
    guide: {
      en: "{pn} [expression]\nExample: {pn} 12 * (3 + 4)",
      bn: "{pn} [গণনার সূত্র]\nউদাহরণ: {pn} 12 * (3 + 4)"
    }
  },

  onStart: async function ({ message, args, language }) {
    const lang = language || "en"; // default to English

    if (!args.length) {
      const msg =
        lang === "bn"
          ? "⚠️ দয়া করে একটি গণনার সূত্র লিখুন।\nউদাহরণ: calc 5*5+10"
          : "⚠️ Please enter a math expression.\nExample: calc 5*5+10";
      return message.reply(msg);
    }

    try {
      const expression = args.join(" ");
      const result = math.evaluate(expression);
      const replyMsg =
        lang === "bn"
          ? `🧮 সূত্র: ${expression}\n✅ ফলাফল: ${result}`
          : `🧮 Expression: ${expression}\n✅ Result: ${result}`;
      message.reply(replyMsg);
    } catch (err) {
      const errorMsg =
        lang === "bn"
          ? "❌ অগ্রহণযোগ্য সূত্র! আবার চেষ্টা করুন।"
          : "❌ Invalid expression! Please try again.";
      message.reply(errorMsg);
    }
  }
};
