const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  category: 'management',
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Locks a channel, preventing members from sending messages')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to lock')
        .setRequired(false)
    ),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply({ content: 'You do not have permission to lock channels.', ephemeral: true });
    }

    try {
      const everyoneRole = interaction.guild.roles.everyone;

      // Update permissions to prevent sending messages
      await channel.permissionOverwrites.edit(everyoneRole, {
        [PermissionsBitField.Flags.SendMessages]: false
      });

      return interaction.reply({ content: `${channel} has been locked.`, ephemeral: false });
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: 'There was an error trying to lock this channel.', ephemeral: true });
    }
  }
};