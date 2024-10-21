const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'utility',
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription("Displays information about a user")
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Select a user')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: false });
      const user = interaction.options.getUser('target');
      const member = interaction.guild.members.cache.get(user.id);

      const statusMap = {
        online: "Online",
        idle: "Idle",
        dnd: "Do Not Disturb",
        offline: "Offline"
      };

      // Fetch the most up-to-date presence
      const presenceStatus = member.presence?.status ? statusMap[member.presence.status] : 'Offline';

      const userInfoEmbed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`${user.username}'s Info`)
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
          { name: 'Username', value: user.tag, inline: true },
          { name: 'User ID', value: user.id, inline: true },
          { name: 'Joined Server On', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
          { name: 'Account Created On', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', '), inline: true },
          { name: 'Current Status', value: presenceStatus, inline: true }
        )
        .setFooter({ text: 'User info by Slasher.' });

      await interaction.editReply({ embeds: [userInfoEmbed], ephemeral: false });
    } catch (error) {
      console.error("An error occurred while creating the user info embed:", error);
      if (interaction.replied || interaction.deferred) {        await interaction.followUp({ content: "Oops! An error occurred while displaying user info. Please try again later.", ephemeral: true });
    } else {
      await interaction.reply({ content: "Oops! An error occurred while displaying user info. Please try again later.", ephemeral: true });
    }
  }
}
};