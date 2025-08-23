"use strict";

module.exports = function (defaultFuncs, api, ctx) {
  return {
    /**
     * Add a user to a group chat
     * @param {string} threadID - Group thread ID
     * @param {string|string[]} userID - User ID(s) to add
     * @param {function} [callback]
     */
    addUserToGroup(userID, threadID, callback) {
      if (!Array.isArray(userID)) userID = [userID];

      const form = {};
      userID.forEach((id, i) => form[`members[${i}]`] = id);

      return defaultFuncs
        .post("/api/v1.0/addMembers", ctx.jar, form)
        .then(res => {
          callback?.(null, res);
          return res;
        })
        .catch(err => {
          callback?.(err);
          throw err;
        });
    },

    /**
     * Remove a user from a group chat
     */
    removeUserFromGroup(userID, threadID, callback) {
      return defaultFuncs
        .post("/api/v1.0/removeMember", ctx.jar, {
          tid: threadID,
          uid: userID
        })
        .then(res => {
          callback?.(null, res);
          return res;
        })
        .catch(err => {
          callback?.(err);
          throw err;
        });
    },

    /**
     * Change group title
     */
    changeGroupTitle(title, threadID, callback) {
      return defaultFuncs
        .post("/api/v1.0/changeThreadTitle", ctx.jar, {
          tid: threadID,
          title
        })
        .then(res => {
          callback?.(null, res);
          return res;
        })
        .catch(err => {
          callback?.(err);
          throw err;
        });
    },

    /**
     * Change nickname of a user in the group
     */
    changeNickname(nickname, userID, threadID, callback) {
      return defaultFuncs
        .post("/api/v1.0/changeNickname", ctx.jar, {
          tid: threadID,
          nickname,
          uid: userID
        })
        .then(res => {
          callback?.(null, res);
          return res;
        })
        .catch(err => {
          callback?.(err);
          throw err;
        });
    }
  };
};
