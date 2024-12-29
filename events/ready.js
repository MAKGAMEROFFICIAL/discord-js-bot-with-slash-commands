const { ActivityType, PresenceUpdateStatus,Client,GatewayIntentBits } = require('discord.js'); 
module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    try {
      console.log(`Logged in as ${client.user.tag}`);

      console.log('Setting presence...');
      await client.user.setPresence({
        activities: [{ name: 'testing', type: ActivityType.Playing }],
        status: PresenceUpdateStatus.DoNotDisturb,
      });

      console.log('Presence successfully updated!');
      console.log('Current presence:', client.user.presence);
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  },
};
