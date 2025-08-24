const axios = require("axios");

module.exports = {
    config: {
        name: "target",
        aliases: ["finduser", "userinfo", "profile"],
        version: "1.0",
        author: "eran_hossain",
        countDown: 5,
        role: 0, // 0 = everyone can use
        category: "fun",
        shortDescription: "Fetches information or profile of a target user",
        longDescription: "Use this command to get information, avatar, or random fun data of a specified user.",
        guide: "{prefix}target <userID or mention>"
    },

    onStart: async function({ api, message, args }) {
        try {
            // Check if user mentioned
            const targetID = args[0] || message.senderID;

            // Example API request (replace with actual API if available)
            const response = await axios.get(`https://some-random-api.ml/pikachu`); // Example endpoint
            // You can use dynamic endpoints for real user info

            // Send result
            api.sendMessage({
                body: `🎯 Target Info for: ${targetID}\n\n` +
                      `Name: Example Name\n` +
                      `Random Info: ${response.data.link || "No data"}`,
                mentions: [{ tag: targetID, id: targetID }]
            }, message.threadID);

        } catch (error) {
            console.error(error);
            api.sendMessage("❌ Failed to fetch target info.", message.threadID);
        }
    }
};
