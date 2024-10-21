const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages from a channel with optional filters.')
        /* Make sure the 'amount' option is required */
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)
        )
        /* The following options are optional and not required */
        .addUserOption(option => 
            option.setName('user')
                .setDescription('Purge messages from a specific user (mention or ID)')
                .setRequired(false)
        )
        .addBooleanOption(option => 
            option.setName('bots')
                .setDescription('Purge messages sent by bots')
                .setRequired(false)
        )
        .addBooleanOption(option => 
            option.setName('embeds')
                .setDescription('Purge messages containing embeds')
                .setRequired(false)
        )
        .addBooleanOption(option => 
            option.setName('media')
                .setDescription('Purge messages containing media (images, videos, etc.)')
                .setRequired(false)
        ),
    async execute(interaction) {
        try {
            const amount = interaction.options.getInteger('amount');
            const user = interaction.options.getUser('user');
            const purgeBots = interaction.options.getBoolean('bots');
            const purgeEmbeds = interaction.options.getBoolean('embeds');
            const purgeMedia = interaction.options.getBoolean('media');

            // Check if the user has the necessary permissions
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {                return interaction.reply({
              content: 'You do not have permission to use this command.',
              ephemeral: true
          });
      }

      // Check if the amount is valid
      if (amount <= 0 || amount > 100) {
          return interaction.reply({
              content: 'Please enter a number between 1 and 100.',
              ephemeral: true
          });
      }

      // Fetch messages and apply filters
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      let filteredMessages = messages;

      if (user) {
          filteredMessages = filteredMessages.filter(msg => msg.author.id === user.id);
      }

      if (purgeBots) {
          filteredMessages = filteredMessages.filter(msg => msg.author.bot);
      }

      if (purgeEmbeds) {
          filteredMessages = filteredMessages.filter(msg => msg.embeds.length > 0);
      }

      if (purgeMedia) {
          filteredMessages = filteredMessages.filter(msg => msg.attachments.size > 0);
      }

      // Bulk delete messages
      await interaction.channel.bulkDelete(filteredMessages, true);

      await interaction.reply({
          content: `Successfully deleted ${filteredMessages.size} messages.`,
          ephemeral: true
      });
  } catch (error) {
      console.error("An error occurred while trying to delete messages:", error);
      await interaction.reply({
          content: 'An error occurred while trying to delete messages. Please try again later.',
          ephemeral: true
      });
  }
}
};