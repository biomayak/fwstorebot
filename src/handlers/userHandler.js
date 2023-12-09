const { getUsersCollection, addUserToDatabase, getTextsCollection } = require('../services/databaseService');
const keyboards = require('../keyboards/keyboards.js');

// Texts
const startText = 'Start';
const instructionsText='Instructions';
const gamesText = 'Games';

async function startHandler(ctx) {

  ctx.reply(await getTextsCollection('start'), keyboards.startReplyMarkup);
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const existingUser = await getUsersCollection().findOne({ userId });

  if (!existingUser) {
    addUserToDatabase(userId, username);
  }

}

async function helpHandler  (userId, username) {
  
}

// Handling buttons
async function instructionsButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('instructions'), keyboards.otherReplyMarkup);
}
async function gamesButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('games'), keyboards.otherReplyMarkup);
}
async function startButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('start'), keyboards.startReplyMarkup);
}

// Add more handler functions as needed

module.exports = {
  startHandler,
  instructionsButtonHandler,
  gamesButtonHandler,
  startButtonHandler
};