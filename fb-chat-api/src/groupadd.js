"use strict";

/**
 * Bot ID + Group Add API
 *
 * Provides helper to fetch the bot's own Facebook ID
 * and add users to a group thread.
 */

module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Cache for bot ID
   */
  let cachedBotID = null;

  /**
   * Get the bot's own user ID
   * @returns {Promise<string>}
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
   * Add one or multiple users to a group
   * @param {string|string[]} userID - User ID(s) to add
   * @param {string} threadID - Group thread ID
   * @param {function} [callback]
   */
  function addUserToGroup(userID, threadID, callback) {
    if (!Array.isArray(userID)) userID = [userID];

    return new Promise((resolve, reject) => {
      api.addUserToGroup(userID, threadID, (err, res) => {
        if (err) {
          callback?.(err);
          return reject(err);
        }
        callback?.(null, res);
        resolve(res);
      });
    });
  }

  /**
   * Add the bot itself to a group (if invited)
   * @param {string} threadID
   * @param {function} [callback]
   */
  async function addBotToGroup(threadID, callback) {
    try {
      const botID = await getBotID();
      const res = await addUserToGroup(botID, threadID);
      callback?.(null, res);
      return res;
    } catch (err) {
      callback?.(err);
      throw err;
    }
  }

  return {
    getBotID,
    addUserToGroup,
    addBotToGroup
  };
};
