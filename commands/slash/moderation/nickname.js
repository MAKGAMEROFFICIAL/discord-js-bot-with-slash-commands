const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v9');

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription("Change a user's nickname in the server")
    .addUserOption(option => 
      option.setName('user')
        .setDescription('The user whose nickname you want to change')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('nickname')
        .setDescription('The new nickname for the user')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const newNickname = interaction.options.getString('nickname');

    // Verify if the bot has permission to manage nicknames
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return interaction.reply({ content: 'I do not have permission to manage nicknames.', ephemeral: true });
    }

    // Verify if the user has permission to manage nicknames
    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    // Check if the new nickname is within Discord's length limit
    if (newNickname.length > 32) {
      return interaction.reply({ content: 'Nicknames cannot be longer than 32 characters.', ephemeral: true });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.setNickname(newNickname);

      const embed = new EmbedBuilder()
        .setColor(0x00ff00)
        .setTitle('Nickname Changed')
        .setDescription(`Successfully changed <@${user.id}>'s nickname to **${newNickname}**.`)
        .setTimestamp();      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Error')
        .setDescription(`Failed to change nickname: ${error.message}`)
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      console.error('Error changing nickname:', error);
    }
  },
};