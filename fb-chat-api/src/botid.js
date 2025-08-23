"use strict";

/**
 * Bot ID Utility
 * 
 * Provides functions to manage and cache the bot's Facebook user ID,
 * including fetching, setting manually, checking, and clearing cache.
 *
 * @param {Object} defaultFuncs - (Unused, for API context consistency)
 * @param {Object} api - API object from facebook-chat-api (or similar)
 * @param {Object} ctx - Context object containing runtime data
 * @returns {Object} Utility methods
 */
module.exports = function (defaultFuncs, api, ctx) {
  /**
   * Cache for bot ID to avoid repeated API calls
   * @type {string|null}
   */
  let cachedBotID = null;

  /**
   * Get the bot's Facebook user ID
   * 
   * @returns {Promise<string>} Resolves to bot user ID as string
   */
  function getBotID() {
    return new Promise((resolve, reject) => {
      // If cached, return immediately
      if (cachedBotID) return resolve(cachedBotID);

      // If already stored in context
      if (ctx.userID) {
        cachedBotID = ctx.userID;
        return resolve(ctx.userID);
      }

      // fallback 1: use getCurrentUserID (callback style)
      if (typeof api.getCurrentUserID === "function") {
        try {
          api.getCurrentUserID((err, userID) => {
            if (err) return reject(err);
            if (!userID) return reject(new Error("getCurrentUserID returned empty ID"));
            cachedBotID = userID.toString();
            ctx.userID = cachedBotID;
            return resolve(cachedBotID);
          });
        } catch (e) {
          return reject(e);
        }
        return;
      }

      // fallback 2: use getCurrentUserInfo (promise or async)
      if (typeof api.getCurrentUserInfo === "function") {
        Promise.resolve(api.getCurrentUserInfo())
          .then((info) => {
            if (!info) return reject(new Error("getCurrentUserInfo returned null/undefined"));

            let id = null;
            if (typeof info.id === "string" || typeof info.id === "number") {
              id = info.id.toString();
            } else if (typeof info === "object") {
              // Handle case: { "123456789": { name: "...", ... } }
              const keys = Object.keys(info);
              if (keys.length > 0) id = keys[0];
            }

            if (!id) return reject(new Error("Failed to extract bot ID from getCurrentUserInfo"));

            cachedBotID = id;
            ctx.userID = id;
            resolve(id);
          })
          .catch(reject);
        return;
      }

      // No valid method
      return reject(new Error("API method to get bot ID not found"));
    });
  }

  /**
   * Set or override the bot's user ID manually
   * 
   * @param {string} id - Facebook user ID of bot
   */
  function setBotID(id) {
    if (typeof id !== "string") {
      throw new TypeError("setBotID: id must be a string");
    }
    cachedBotID = id;
    ctx.userID = id;
  }

  /**
   * Check if given ID matches the bot's ID
   * 
   * @param {string} id - Facebook user ID
   * @returns {Promise<boolean>} Resolves true if matches bot ID, else false
   */
  async function isBotID(id) {
    if (typeof id !== "string") {
      throw new TypeError("isBotID: id must be a string");
    }
    const botID = await getBotID();
    return id === botID;
  }

  /**
   * Clear cached bot ID (useful on logout or reconnect)
   */
  function clearCache() {
    cachedBotID = null;
    if ("userID" in ctx) {
      delete ctx.userID; // safer than setting null
    }
  }

  // Expose utility functions
  return {
    getBotID,
    setBotID,
    isBotID,
    clearCache,
  };
};
