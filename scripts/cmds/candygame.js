const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "candygame.json");
let candyData = {};

// Load data
if (fs.existsSync(dataPath)) {
  try {
    candyData = JSON.parse(fs.readFileSync(dataPath, "utf-8")) || {};
  } catch (err) {
    candyData = {};
    fs.writeFileSync(dataPath, JSON.stringify(candyData, null, 2));
  }
} else {
  fs.writeFileSync(dataPath, JSON.stringify(candyData, null, 2));
}

module.exports = {
  config: {
    name: "candygame",
    aliases: ["candy", "collectcandy"],
    version: "1.0",
    author: "eran_hossain",
    countDown: 5,
    role: 0,
    category: "game",
    shortDescription: "Collect candies and check your score",
    longDescription: "A simple candy collection game where users can collect candies and see their total.",
    guide: "{pn}candygame - collect candies\n{pn}candygame stats - check your candies"
  },

  onStart: async function ({ message, args }) {
    const userId = message.senderID;

    if (!candyData[userId]) candyData[userId] = { candies: 0 };

    if (args[0] === "stats") {
      return message.reply(`🍬 You have ${candyData[userId].candies} candies!`);
    }

    // Collect a random number of candies
    const collected = Math.floor(Math.random() * 10) + 1;
    candyData[userId].candies += collected;

    // Save data
    fs.writeFileSync(dataPath, JSON.stringify(candyData, null, 2));

    message.reply(`🍬 You collected ${collected} candies! You now have ${candyData[userId].candies} candies.`);
  }
};
