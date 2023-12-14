const helperFunctions = require('../utils/helperFunctions');
const databaseService = require('../services/databaseService');

async function transferOwnershipHandler(ctx) {
    const newOwnerUsername = ctx.message.text.split(' ')[1].substring(1);
  
    if (!newOwnerUsername) {
      ctx.reply('Укажите юзернейм.');
      return;
    }
  
    // Check if the current user is the owner
    const currentUser = await databaseService.getUserById(ctx.from.id);
    console.log(currentUser);
    if (currentUser && currentUser.role === 'owner') {
      // Find the new owner by username
      const newOwner = await databaseService.getUserByUsername(newOwnerUsername);
  
      if (newOwner) {
        // Update the new owner's status
        await databaseService.getUsersCollection().updateOne({ userId: newOwner.userId }, { $set: { role: 'owner' } });
  
        // Remove ownership from the current owner
        await databaseService.getUsersCollection().updateOne({ userId: ctx.from.id }, { $set: { role: 'admin' } });
  
        // Notify the new owner
        const ownershipMessage = 'Теперь вы владелец.';
        await helperFunctions.sendMessageToUser(ctx, newOwner.userId, ownershipMessage);
  
        ctx.reply(`${newOwner.username} теперь владелец.`);
      } else {
        ctx.reply('Пользователь не найден.');
      }
    } else {
      ctx.reply('Недостаточно прав.');
    }
}

async function setAdminHandler(ctx) {
    const adminUsername = ctx.message.text.split(' ')[1].substring(1);
  
    // Check if the current user is the owner
    const currentUser = await databaseService.getUserById(ctx.from.id);
    if (currentUser && currentUser.role === 'owner') {
        // Find the user by username
        const adminUser = await databaseService.getUserByUsername(adminUsername);
    
        if (adminUser) {
            // Update the user's role to admin
            await databaseService.updateRole(adminUser.userId, 'admin');
            ctx.reply(`${adminUser.username} теперь администратор.`);
        } else {
            ctx.reply('Пользователь не найден.');
        }
    } else {
        ctx.reply('Недостаточно прав.');
    }
}
  
async function disbandAdminHandler(ctx) {
    const adminUsername = ctx.message.text.split(' ')[1].substring(1);
  
    // Check if the current user is the owner
    const currentUser = await databaseService.getUserById(ctx.from.id);
    if (currentUser && currentUser.role === 'owner') {
        // Find the user by username
        const adminUser = await databaseService.getUserByUsername(adminUsername);
    
        if (adminUser) {
            // Update the user's role to remove admin rights
            await databaseService.updateRole(adminUser.userId, 'user');
            ctx.reply(`${adminUser.username} больше не администратор.`);
        } else {
            ctx.reply('Пользователь не найден.');
        }
    } else {
        ctx.reply('Недостаточно прав.');
    }
}

module.exports = {
    transferOwnershipHandler,
    setAdminHandler,
    disbandAdminHandler
};