// helperFunctions.js
const { getAdminCache } = require('../services/databaseService');

// Function to send a message to a specific user
async function sendMessageToUser(ctx, userId, text) {
  try {
    await ctx.telegram.sendMessage(userId, text);
    console.log(`Message sent to user ${userId}`);
  } catch (error) {
    if ((error??response??error_code > 399) && (error??response??error_code < 500)) {
      console.log(`Cannot send message to user ${userId}.`);
      return 0;
    }
    console.error(`Error sending message to user ${userId}:`, error);
  }
}

// Function to send a photo to a specific user
async function sendPhotoToUser(ctx, userId, photoFileId, caption) {
  try {
    await ctx.telegram.sendPhoto(userId, photoFileId, {
      caption: caption,
    });
  } catch (error) {
    if ((error??response??error_code > 399) && (error??response??error_code < 500)) {
      console.log(`Cannot send photo to user ${userId}.`);
      return;
    }
    console.error(`Error sending photo to user ${userId}:`, error);
  }
}
  
// Function to check if a user is an admin
async function isAdminUser(userId) {
  console.log (`Checking if user ${userId} is an admin`);
  return getAdminCache().includes(userId);
}
  
module.exports = {
    sendMessageToUser,
    sendPhotoToUser,
w    isAdminUser
};