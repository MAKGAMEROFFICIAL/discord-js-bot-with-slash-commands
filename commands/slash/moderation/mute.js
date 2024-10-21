const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'moderation',
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mute a user in the server.')
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Duration of mute in minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The ID of the user to mute')
        .setRequired(false))
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute from the list')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for muting the user')
        .setRequired(false)),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const userOption = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Check if either 'User ID' or 'User' is provided, but not both
    if ((!userId && !userOption) || (userId && userOption)) {
      return await interaction.reply({ content: 'You must provide either a User ID or select a user, not both.', ephemeral: true });
    }
    await interaction.deferReply({ ephemeral: false });

    // Check for 'ModerateMembers' permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
      return await interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
      const user = userOption || await interaction.client.users.fetch(userId.trim());
      const member = await interaction.guild.members.fetch(user.id);

      if (!member) {        return await interaction.editReply({ content: `User ${user.tag} not found.`, ephemeral: true });
    }

    const muteDuration = Date.now() + duration * 60 * 1000;
    await member.disableCommunicationUntil(muteDuration, reason);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('User Muted')
      .setDescription(`Successfully muted <@${user.id}> for ${duration} minutes.`)
      .addFields(
        { name: 'Reason', value: reason },
      )
      .setTimestamp()
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }));

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    const errorEmbed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle('Error')
      .setDescription(`Failed to mute user: ${error.message}`)
      .setTimestamp();

    await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    console.error('Error muting user:', error);
  }
},
};