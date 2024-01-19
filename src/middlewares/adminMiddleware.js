// adminMiddleware.js
const { getAdminCache } = require('../services/databaseService');
const helperFunctions = require('../utils/helperFunctions');

// Middleware to forward messages from regular users to admins
async function forwardMessagesToAdmins(ctx, next) {
  // Check if the message is from a regular user
  if (!await helperFunctions.isAdminUser(ctx.from.id) && ctx.message) {
    getAdminCache().forEach(async (adminUserId) => {
      await helperFunctions.sendMessageToUser(ctx, adminUserId, `Отправитель: ${ctx.from.id}\n${ctx.message.text}`, ctx.message.message_id);
    });
  }

  // Continue to the next middleware or handler
  return next();
}

module.exports = {
  forwardMessagesToAdmins,
};