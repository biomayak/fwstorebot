// adminMiddleware.js
const { getAdminCache } = require('../services/databaseService');
const helperFunctions = require('../utils/helperFunctions');

async function forwardMessagesToAdmins(ctx, next) {
  // Check if the message is from a regular user
  if (!await helperFunctions.isAdminUser(ctx.from.id) && ctx.message) {
    const messageText = ctx.message.text ? `\nТекст: ${ctx.message.text}` : '';
    const messageCaption = ctx.message.caption ? `\nПодпись: ${ctx.message.caption}` : '';

    const sendMessage = async (adminUserId) => {
      console.log(adminUserId);
      if (ctx.message.photo) {
        // Forward the photo to the admin
        const photoFileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        await ctx.telegram.sendPhoto(adminUserId, photoFileId, {
          caption: `Отправитель: ${ctx.from.id}${messageCaption}`,
        });
      } else if (ctx.message.text) {
        // Forward the text message to the admin
        await helperFunctions.sendMessageToUser(
          ctx,
          adminUserId,
          `Отправитель: ${ctx.from.id}${messageText}`,
          ctx.message.message_id
        );
      }
    };

    const adminIds = await getAdminCache();
    await Promise.all(adminIds.map(sendMessage));
  }

  // Continue to the next middleware or handler
  return next();
}

module.exports = {
  forwardMessagesToAdmins,
};