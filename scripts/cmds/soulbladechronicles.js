const fs = require("fs-extra");
const path = require("path");

// Data storage
const dataPath = path.join(__dirname, "soulbladeData.json");
let userData = {};
if (fs.existsSync(dataPath)) {
  userData = fs.readJsonSync(dataPath);
} else {
  fs.writeJsonSync(dataPath, {});
}

module.exports = {
  config: {
    name: "soulbladechronicles",
    aliases: ["soulblade", "sbchronicles"],
    version: "2.0",
    author: "eran",
    countDown: 5,
    role: 0,
    shortDescription: "Anime battle RPG game",
    longDescription: "Play SoulBlade Chronicles – fight monsters, earn XP & coins, buy items, and level up!",
    category: "game",
    guide: "{pn} [profile | attack | heal | shop | buy <item> | inventory | boss | reset]"
  },

  onStart: async function ({ message, event, args }) {
    const uid = event.senderID;

    // Initialize player if not exist
    if (!userData[uid]) {
      userData[uid] = { hp: 100, xp: 0, level: 1, coins: 50, inventory: [] };
      fs.writeJsonSync(dataPath, userData);
    }

    const player = userData[uid];
    const command = args[0]?.toLowerCase()

    if (!command) {
      return message.reply(
        `⚔️ SoulBlade Chronicles ⚔️\n\n` +
        `🔹 Profile: {pn} profile\n` +
        `🔹 Attack monster: {pn} attack\n` +
        `🔹 Heal: {pn} heal\n` +
        `🔹 Shop: {pn} shop\n` +
        `🔹 Buy item: {pn} buy <item>\n` +
        `🔹 Inventory: {pn} inventory\n` +
        `🔹 Boss fight: {pn} boss\n` +
        `🔹 Reset: {pn} reset`
      );
    }

    // 📜 Profile
    if (command === "profile") {
      return message.reply(
        `👤 SoulBlade Profile\n` +
        `❤️ HP: ${player.hp}\n` +
        `⭐ XP: ${player.xp}\n` +
        `⬆️ Level: ${player.level}\n` +
        `💰 Coins: ${player.coins}\n` +
        `🎒 Inventory: ${player.inventory.length ? player.inventory.join(", ") : "Empty"}`
      );
    }

    // ⚔️ Attack
    if (command === "attack") {
      const damage = Math.floor(Math.random() * 20) + 5;
      const monsterHP = Math.floor(Math.random() * 50) + 30;

      if (damage >= monsterHP) {
        player.xp += 20;
        player.coins += 15;
        if (player.xp >= player.level * 100) {
          player.level++;
          player.hp = 100;
          player.xp = 0;
          message.reply(`🔥 You defeated the monster and leveled up! Now level ${player.level}!`);
        } else {
          message.reply(`⚔️ You defeated the monster!\n+20 XP\n+15 Coins`);
        }
      } else {
        player.hp -= 15;
        if (player.hp <= 0) {
          player.hp = 0;
          message.reply(`💀 You were defeated! Use {pn} heal or reset.`);
        } else {
          message.reply(`💢 The monster hit back! Your HP is now ${player.hp}.`);
        }
      }

      fs.writeJsonSync(dataPath, userData);
      return;
    }

    // 💖 Heal
    if (command === "heal") {
      if (player.coins < 20) return message.reply("❌ Not enough coins! (Need 20)");
      player.hp = 100;
      player.coins -= 20;
      fs.writeJsonSync(dataPath, userData);
      return message.reply("💖 You healed back to full HP (100)! -20 coins");
    }

    // 🏪 Shop
    if (command === "shop") {
      return message.reply(
        `🏪 SoulBlade Shop:\n` +
        `1. Potion (30 coins) – Restore HP instantly\n` +
        `2. Sword (100 coins) – Extra damage in fights\n` +
        `3. Shield (100 coins) – Reduce damage taken\n` +
        `Buy with: {pn} buy <item>`
      );
    }

    // 🛒 Buy
    if (command === "buy") {
      const item = args.slice(1).join(" ").toLowerCase();
      if (!item) return message.reply("❌ Please specify an item to buy.");

      const shop = {
        potion: 30,
        sword: 100,
        shield: 100
      };

      if (!shop[item]) return message.reply("❌ That item doesn't exist in the shop.");
      if (player.coins < shop[item]) return message.reply("❌ Not enough coins!");

      player.coins -= shop[item];
      player.inventory.push(item);
      fs.writeJsonSync(dataPath, userData);

      return message.reply(`✅ You bought a **${item}** for ${shop[item]} coins!`);
    }

    // 🎒 Inventory
    if (command === "inventory") {
      return message.reply(
        `🎒 Your Inventory:\n${player.inventory.length ? player.inventory.join(", ") : "Empty"}`
      );
    }

    // 👹 Boss Fight
    if (command === "boss") {
      const bossHP = Math.floor(Math.random() * 120) + 80;
      const playerDamage = Math.floor(Math.random() * 40) + 20;

      if (playerDamage >= bossHP) {
        player.xp += 50;
        player.coins += 50;
        message.reply(`👹🔥 You defeated the BOSS! +50 XP +50 Coins`);
      } else {
        player.hp -= 30;
        if (player.hp <= 0) {
          player.hp = 0;
          message.reply(`💀 The boss crushed you! Use {pn} heal or reset.`);
        } else {
          message.reply(`⚡ The boss hit back! Your HP is now ${player.hp}.`);
        }
      }

      fs.writeJsonSync(dataPath, userData);
      return;
    }

    // 🔄 Reset
    if (command === "reset") {
      userData[uid] = { hp: 100, xp: 0, level: 1, coins: 50, inventory: [] };
      fs.writeJsonSync(dataPath, userData);
      return message.reply("🔄 Your SoulBlade profile has been reset!");
    }

    return message.reply("❌ Invalid command. Try: profile | attack | heal | shop | buy | inventory | boss | reset");
  }
};
