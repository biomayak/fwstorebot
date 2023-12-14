const { Telegraf } = require('telegraf');
const adminMiddleware = require('./middlewares/adminMiddleware');
const userHandler = require('./handlers/userHandler');
const adminHandler = require('./handlers/adminHandler');
const ownerHandler = require('./handlers/ownerHandler');
const databaseService = require('./services/databaseService');

console.log('Starting bot...');

async function runBot() {
  try {
    // Initialize database connection
    console.log('Starting database connection...');
    await databaseService.connectToDatabase();

    // Initialize admin and texts cache after the database connection is established
    await databaseService.initAdminCache();
    await databaseService.initTextsCache();

    // Start the bot after initializing the database and admin cache
    const bot = new Telegraf(process.env.BOT_TOKEN);

    // Set up middlewares
    bot.use(adminMiddleware.forwardMessagesToAdmins);

    // Owner handlers
    bot.command('transferOwnership', ownerHandler.transferOwnershipHandler);
    bot.command('setAdmin', ownerHandler.setAdminHandler);
    bot.command('disbandAdmin', ownerHandler.disbandAdminHandler);

    // Admin handlers
    bot.command('listSections', adminHandler.listSectionsHandler);
    bot.command('listAdmins', adminHandler.listAdminsHandler);
    bot.command('broadcast', adminHandler.broadcastHandler);
    bot.command('sendMessage', adminHandler.sendMessageHandler);
    bot.command('changeText', adminHandler.changeTextHandler);

    // User handlers
    bot.command('help', userHandler.helpHandler);

    bot.start(userHandler.startHandler);
    bot.action('start', userHandler.startButtonHandler);

    bot.action('instructions', userHandler.instructionsButtonHandler);

    bot.action('games', userHandler.gamesButtonHandler);
    bot.action('gamesXbox', userHandler.gamesXboxButtonHandler);
    bot.action('gamesPC', userHandler.gamesPCButtonHandler);
    bot.action('gamesXbox360', userHandler.gamesXbox360ButtonHandler);

    bot.action('subscriptions', userHandler.subscriptionsButtonHandler);
    bot.action('subscriptionsXbox', userHandler.subscriptionsXboxButtonHandler);
    bot.action('subscriptionsPC', userHandler.subscriptionsPCButtonHandler);

    bot.action('currencies', userHandler.currenciesButtonHandler);
    bot.action('currenciesXbox', userHandler.currenciesXboxButtonHandler);
    bot.action('currenciesPC', userHandler.currenciesPCButtonHandler);

    bot.action('sales', userHandler.salesButtonHandler);
    bot.action('salesXbox', userHandler.salesXboxButtonHandler);
    bot.action('salesPC', userHandler.salesPCButtonHandler);

    // Launch the bot
    bot.launch();

    // Enable graceful stop
    process.once('SIGINT', () => {
      databaseService.closeDatabaseConnection();
      bot.stop('SIGINT');
    });

    process.once('SIGTERM', () => {
      databaseService.closeDatabaseConnection();
      bot.stop('SIGTERM');
    });
  } catch (error) {
    console.error('Error running the bot:', error);
  }
}

// Run the bot
runBot();