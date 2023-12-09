const { Telegraf } = require('telegraf');
const adminMiddleware = require('./middlewares/adminMiddleware');
const userHandler = require('./handlers/userHandler');
const adminHandler = require('./handlers/adminHandler');
const ownerHandler = require('./handlers/ownerHandler');
const databaseService = require('./services/databaseService');

async function runBot() {
  try {
    // Initialize database connection
    await databaseService.connectToDatabase();

    // Initialize admin and texts cache after the database connection is established
    await databaseService.initAdminCache();
    await databaseService.initTextsCache();

    // Log the usersCollection and adminCache after initialization
    console.log(databaseService.getUsersCollection());
    console.log(databaseService.getAdminCache());

    // Start the bot after initializing the database and admin cache
    const bot = new Telegraf(process.env.BOT_TOKEN);

    // Set up middlewares
    bot.use(adminMiddleware.forwardMessagesToAdmins);

    // Owner handlers
    bot.command('transferOwnership', ownerHandler.transferOwnershipHandler);
    bot.command('setAdmin', ownerHandler.setAdminHandler);
    bot.command('disbandAdmin', ownerHandler.disbandAdminHandler);

    // Admin handlers
    bot.command('listAdmins', adminHandler.listAdminsHandler);
    bot.command('broadcast', adminHandler.broadcastHandler);
    bot.command('sendMessage', adminHandler.sendMessageHandler);
    bot.command('changeText', adminHandler.changeTextHandler);

    // User handlers
    bot.start(userHandler.startHandler);
    bot.action('instructions', userHandler.instructionsButtonHandler);
    bot.action('games', userHandler.gamesButtonHandler);
    bot.action('start', userHandler.startButtonHandler);

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