const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // You can set the bot's presence (status) here
    client.user.setPresence({
      activities: [
        { name: 'with code!', type: 'PLAYING' },
      ],
      status: 'dnd',
    });

    // Additional initialization code can go here
    console.log('Bot is now ready to handle commands!');
  },
};
