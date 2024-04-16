const { getUsersCollection, addUserToDatabase, getTextsCollection, getOwnerCache } = require('../services/databaseService');
const { isAdminUser } = require('../utils/helperFunctions.js');
const keyboards = require('../keyboards/keyboards.js');

async function startHandler(ctx) {

  ctx.reply(await getTextsCollection('start'), keyboards.startReplyMarkup);
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const existingUser = await getUsersCollection().findOne({ userId });

  if (!existingUser) {
    addUserToDatabase(userId, username);
  }

}

async function helpHandler  (ctx) {
  let replyString = '';
  if (ctx.from.id === await getOwnerCache()) {
    replyString += '/transferOwnership [@юзернейм] - передать права владельца другому пользователю.\n/setAdmin [@юзернейм] - выдать права администратора пользователю.\n/disbandAdmin [@юзернейм] - забрать права администратора у пользователя.\n'
  }
  if (await isAdminUser(ctx.from.id)) {
    replyString += '/listAdmins - вывести список администраторов.\n/broadcast [текст] - отправить текста всем пользователям бота.\n/sendMessage [айди|@юзернейм] [текст] ([картинка]) - отрпавить сообщение конкретному пользователю. Айди - айди пользователя в формате цифр (например 1234567), юзернейм (например @telegram). Картинка - опционально.\n/changeText [раздел] [текст] - изменить текст в указанном разделе (start, instructions, games, gamesXbox, gamesPC) на указанный.\n/listSections - вспомогательная команда, которая выводит обозначения секций для команды /changeText\n';
  }
  replyString += '/start - открыть меню';
  ctx.reply(replyString);
}

// Handling buttons
async function instructionsButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('instructions'), keyboards.instructionsReplyMarkup);
}
async function gamesButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('games'), keyboards.gamesReplyMarkup);
}
async function startButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('start'), keyboards.startReplyMarkup);
}
async function subscriptionsButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('subscriptions'), keyboards.subscriptionsReplyMarkup);
}
async function currenciesButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('currencies'), keyboards.currenciesReplyMarkup);
}
async function salesButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('sales'), keyboards.salesReplyMarkup);
}

// Handling Games section buttons
async function gamesXboxButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('gamesXbox'), keyboards.backToGamesReplyMarkup);
}
async function gamesPCButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('gamesPC'), keyboards.backToGamesReplyMarkup);
}
async function gamesXbox360ButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('gamesXbox360'), keyboards.backToGamesReplyMarkup);
}
// Handling Subsctriptions section buttons
async function subscriptionsXboxButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('subscriptionsXbox'), keyboards.backToSubscriptionsReplyMarkup);
}
async function subscriptionsPCButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('subscriptionsPC'), keyboards.backToSubscriptionsReplyMarkup);
}
// Handling Currencies section buttons
async function currenciesXboxButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('currenciesXbox'), keyboards.backToCurrenciesReplyMarkup);
}
async function currenciesPCButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('currenciesPC'), keyboards.backToCurrenciesReplyMarkup);
}
// Handling Sales section buttons
async function salesXboxButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('salesXbox'), keyboards.backToSalesReplyMarkup);
}
async function salesPCButtonHandler(ctx) {
  ctx.editMessageText(await getTextsCollection('salesPC'), keyboards.backToSalesReplyMarkup);
}

module.exports = {
  helpHandler,

  startHandler,
  startButtonHandler,

  instructionsButtonHandler,
  gamesButtonHandler,
  subscriptionsButtonHandler,
  currenciesButtonHandler,
  salesButtonHandler,

  gamesXboxButtonHandler,
  gamesPCButtonHandler,
  gamesXbox360ButtonHandler,
  subscriptionsXboxButtonHandler,
  subscriptionsPCButtonHandler,
  currenciesXboxButtonHandler,
  currenciesPCButtonHandler,
  salesXboxButtonHandler,
  salesPCButtonHandler
};