const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from the server.')
    .addStringOption(option => 
      option.setName('userid')
        .setDescription('The ID of the user to unban')
        .setRequired(true)),
  async execute(interaction) {
    const userId = interaction.options.getString('userid');

    // Defer the reply to prevent the interaction from timing out
    await interaction.deferReply({ ephemeral:false });

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
        return await interaction.editReply({ content: 'You do not have permission to use this command.' });
    }

    try {
      const bannedUsers = await interaction.guild.bans.fetch();
      const isUserBanned = bannedUsers.some(ban => ban.user.id === userId);

      if (!isUserBanned) {
          const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Error')
            .setDescription('User is not banned or does not exist in the ban list.')
            .setTimestamp();

          return await interaction.editReply({ embeds: [embed] });
      }

      await interaction.guild.bans.remove(userId);
      const embed = new EmbedBuilder()
          .setColor(0x00ff00)
          .setTitle('User Unbanned')
          .setDescription(`Successfully unbanned <@${userId}>`)
          .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Error')
          .setDescription(`Failed to unban user: ${error.message}`)
          .setTimestamp();

      // since we already deferred the reply
      await interaction.editReply({ embeds: [embed] });      console.error('Error unbanning user:', error);
    }
  },
};