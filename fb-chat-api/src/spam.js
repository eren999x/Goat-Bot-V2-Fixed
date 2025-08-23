"use strict";

/**
 * Spam API
 *
 * Allows sending repeated messages to a target,
 * but prevents spamming the bot's own ID.
 */

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Cache for bot ID
   */
  let cachedBotID = null;

  /**
   * Get bot's user ID
   */
  function getBotID() {
    return new Promise((resolve, reject) => {
      if (cachedBotID) return resolve(cachedBotID);

      api.getCurrentUserID((err, id) => {
        if (err) return reject(err);
        cachedBotID = id.toString();
        resolve(cachedBotID);
      });
    });
  }

  /**
   * Spam a target user/thread with a message
   * but block if target is bot itself
   *
   * @param {string} threadID - Target ID (user or group)
   * @param {string} message - Message text
   * @param {number} count - How many times
   * @param {function} [callback]
   */
  async function spam(threadID, message, count = 5, callback) {
    try {
      const botID = await getBotID();

      if (threadID.toString() === botID) {
        const err = new Error("❌ Cannot spam the bot’s own ID!");
        callback?.(err);
        throw err;
      }

      let results = [];
      for (let i = 0; i < count; i++) {
        const res = await new Promise((resolve, reject) => {
          api.sendMessage(message, threadID, (err, info) => {
            if (err) return reject(err);
            resolve(info);
          });
        });
        results.push(res);
      }

      callback?.(null, results);
      return results;

    } catch (err) {
      callback?.(err);
      throw err;
    }
  }

  return {
    spam
  };
};
