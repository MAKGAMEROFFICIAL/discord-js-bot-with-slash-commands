const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server.')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user to kick')
        .setRequired(true)),
  async execute(interaction) {
    const member = interaction.options.getMember('target');

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    if (member) {
      try {
        await member.kick();
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('User Kicked')
          .setDescription(`Successfully kicked <@${member.id}>`)
          .setTimestamp()
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 128 }));

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Error')
          .setDescription(`Failed to kick member: ${error.message}`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        console.error('Error kicking member:', error);
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Error')
        .setDescription('Member not found.')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    }
  },
};