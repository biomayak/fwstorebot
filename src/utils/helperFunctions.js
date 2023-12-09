// helperFunctions.js
const { getAdminCache } = require('../services/databaseService');

// Function to send a message to a specific user
async function sendMessageToUser(ctx, userId, message) {
    try {
      await ctx.telegram.sendMessage(userId, message);
      console.log(`Message sent to user ${userId}`);
    } catch (error) {
      console.error(`Error sending message to user ${userId}:`, error);
    }
  }
  
// Function to check if a user is an admin
async function isAdminUser(userId) {
  return getAdminCache().includes(userId);
}
  
module.exports = {
    sendMessageToUser,
    isAdminUser
};