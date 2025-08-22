const fs = require("fs-extra");
const path = require("path");

const dataPath = path.join(__dirname, "spamkick.json");
let spamData = {};
if (fs.existsSync(dataPath)) {
  spamData = fs.readJsonSync(dataPath);
} else {
  fs.writeJsonSync(dataPath, {});
}

// Load VIP & Whitelist
const vipPath = path.join(__dirname, "vip.json");
let vipData = {};
if (fs.existsSync(vipPath)) vipData = fs.readJsonSync(vipPath);

const whitelistPath = path.join(__dirname, "whitelist.json");
let whitelistData = {};
if (fs.existsSync(whitelistPath)) whitelistData = fs.readJsonSync(whitelistPath);

module.exports = {
  config: {
    name: "spamkick",
    aliases: ["antispam", "kickspam"],
    version: "2.0",
    author: "eran_hossain",
    countDown: 5,
    role: 1, // admin only
    shortDescription: "Auto kick spammers from group",
    longDescription: "Detect spam and automatically kick the spammer from the group. Supports VIP & Whitelist users.",
    category: "group",
    guide: "{pn} [on/off]"
  },

  // Enable / Disable command
  onStart: async function ({ message, args, event }) {
    const { threadID } = event;
    if (!spamData[threadID]) spamData[threadID] = { enabled: false, users: {}, logs: [] };

    if (args[0] === "on") {
      spamData[threadID].enabled = true;
      message.reply("✅ SpamKick is now ENABLED for this group.");
    } else if (args[0] === "off") {
      spamData[threadID].enabled = false;
      message.reply("❌ SpamKick is now DISABLED for this group.");
    } else {
      message.reply(`📌 SpamKick status: ${spamData[threadID].enabled ? "✅ ON" : "❌ OFF"}\nUse: {pn} on / off`);
    }

    fs.writeJsonSync(dataPath, spamData, { spaces: 2 });
  },

  // Spam detection
  onChat: async function ({ message, event, api }) {
    const { threadID, senderID, body } = event;
    if (!spamData[threadID] || !spamData[threadID].enabled) return;

    // Skip bot itself
    if (senderID === api.getCurrentUserID()) return;

    // Skip Whitelist
    if (whitelistData.enabled && whitelistData.userIDs?.includes(senderID)) return;

    // Skip VIPs
    if (vipData.userIDs?.includes(senderID)) return;

    // Skip group admins
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      if (threadInfo.adminIDs.some(admin => admin.id == senderID)) return;
    } catch (e) {}

    // Initialize user data
    if (!spamData[threadID].users[senderID]) {
      spamData[threadID].users[senderID] = { lastMsg: "", count: 0, warns: 0, time: Date.now() };
    }

    let user = spamData[threadID].users[senderID];

    // Spam check: repeated or too fast
    if (user.lastMsg === body || Date.now() - user.time < 1500) {
      user.count++;
    } else {
      user.count = 0;
    }

    user.lastMsg = body;
    user.time = Date.now();

    // First warning
    if (user.count === 3 && user.warns < 1) {
      user.warns++;
      message.reply(`⚠️ @${senderID}, stop spamming or you will be kicked!`, event.threadID, event.messageID);
    }

    // Kick if spamming continues
    if (user.count >= 5 && user.warns >= 1) {
      try {
        await api.removeUserFromGroup(senderID, threadID);
        message.reply(`🚫 User ${senderID} has been kicked for spamming!`);

        // Save to logs
        spamData[threadID].logs.push({
          user: senderID,
          time: new Date().toISOString(),
          reason: "Spamming messages"
        });

      } catch (e) {
        message.reply("❌ Failed to kick user. Bot might not be admin.");
      }
    }

    fs.writeJsonSync(dataPath, spamData, { spaces: 2 });
  }
};
