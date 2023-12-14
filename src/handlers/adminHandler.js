const helperFunctions = require('../utils/helperFunctions');
const { getUsersCollection, isUserInCollection, setTextsCollection } = require('../services/databaseService');

async function listAdminsHandler(ctx) {
  if (!await helperFunctions.isAdminUser(ctx.from.id)) { return null; }
  let string = '';
  const owner = await getUsersCollection().find({ role: 'owner'}).toArray();
  const admins = await getUsersCollection().find({ role: 'admin'}).toArray();
  string += `Владелец: @${owner[0].username}\n`;
  admins.forEach((value) => { string += `Администратор: @${value.username}\n`; })
  ctx.reply(string);
}

// Broadcast command handler
async function broadcastHandler(ctx) {

  if (!await helperFunctions.isAdminUser(ctx.from.id)) { return null; };

  try {

    // Get broadcast message text
    const message = ctx.message.text.split('/broadcast')[1].trim();
    
    // Fetch all users
    const users = await getUsersCollection().find({}).toArray();
    
    // Counter to track processed 
    let processed = 0;
    
    // Send message sequentially 
    const promises = users.map(user => {
      return helperFunctions.sendMessageToUser(ctx, user.userId, message)
        .then(() => {
          processed++;
        })
        .catch((err) => {
          console.log(err);
        })
    })
    
    await Promise.all(promises);

    // Reply back with confirmation
    ctx.reply(`Объявление доставлено ${processed} чатам.`);

  } catch(err) {
    console.log(err);
  }

}

async function sendMessageHandler(ctx) {
  // Check if the user is an admin
  const userId = ctx.from.id;
  const isAdmin = await helperFunctions.isAdminUser(userId);

  if (!isAdmin) {
    return ctx.reply('Недостаточно прав.');
  }

  // Extract section and text from the message
  let [command, receiver, ...textArray] = ctx.message.text.split(' ');
  if (!receiver || !textArray) { return; }
  const text = textArray.join(' ');
  const isUsername = [...receiver][0] === '@';

  try {
    if (isUsername) {
      receiver = receiver.substring(1);
      const receiverUser = await getUsersCollection().findOne({ username: receiver });
      console.log(receiverUser);
      if (!receiverUser) {
        ctx.reply(`Пользователь @${receiver} не найден.`);
        return;
      }
      helperFunctions.sendMessageToUser(ctx, receiverUser.userId, text);
      console.log(`sendMessage: Message sent to ${receiverUser.userId}`);
    } else {
      const userExists = await isUserInCollection(receiver);
      console.log(userExists);
      if (!userExists) {
        ctx.reply(`Пользователь ${receiver} не найден.`);
        return;
      }

      if (!text) {
        ctx.reply('Текст не найден.');
        return;
      }

      helperFunctions.sendMessageToUser(ctx, receiver, text);
      console.log(`sendMessage: Message sent to ${receiver}`);
    }
  } catch (err) {
    console.error(`sendMessage: ${err}`);
    ctx.reply(err.text || 'Произошла ошибка при отправке сообщения.');
  }
}


async function changeTextHandler(ctx) {
  // Check if the user is an admin
  const userId = ctx.from.id;
  const isAdmin = await helperFunctions.isAdminUser(userId);

  if (!isAdmin) {
    return ctx.reply('Недостаточно прав.');
  }

  // Extract section and text from the message
  const [command, section, ...textArray] = ctx.message.text.split(' ');
  const text = textArray.join(' ');

  // Check if both section and text are provided
  if (!section || !text) {
    return ctx.reply('Пожалуйста, укажите раздел для смены текста и сам текст в одном сообщении.');
  }

  // Update the textsCollection
  await setTextsCollection(section, text);

  // Respond to the admin
  return ctx.reply(`Текст для раздела '${section}' обновлён.`);
}

async function listSectionsHandler (ctx) {
  // Check if the user is an admin
  const userId = ctx.from.id;
  const isAdmin = await helperFunctions.isAdminUser(userId);

  if (!isAdmin) {
    return ctx.reply('Недостаточно прав.');
  }

  return ctx.reply(
    'Меню - "start"\n' +
    '\nИгры - "games"' +
    '\n\tИгры для Xbox Series X|S и Xbox One - "gamesXbox"' +
    '\n\tИгры для PC - "gamesPC"' +
    '\n\tОбратно совместимые игры Xbox и Xbox 360 - "gamesXbox360"\n' +
    '\nПодписки - "subscriptions"' +
    '\n\tПодписки для Xbox Series X|S и Xbox One - "subscriptionsXbox"' +
    '\n\tПодписки для PC - "subscriptionsPC"\n' +
    '\nВнутриигровая валюта - "currencies"' +
    '\n\tВнутриигровая валюта для Xbox Series X|S и Xbox One - "currenciesXbox"' +
    '\n\tВнутриигровая валюта для PC - "currenciesPC"\n' +
    '\nСкидки - "sales"' +
    '\n\tСкидки для Xbox Series X|S и Xbox One - "salesXbox"' +
    '\n\tСкидки для PC - "salesPC"'
  )
}

module.exports = {
  listAdminsHandler,
  broadcastHandler,
  sendMessageHandler,
  changeTextHandler,
  listSectionsHandler
};
