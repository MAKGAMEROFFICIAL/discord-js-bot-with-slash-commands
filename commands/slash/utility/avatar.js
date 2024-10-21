const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Displays a user's avatar.")
    .addUserOption(option => option
      .setName('target')
      .setDescription('The user to get the avatar of')
      .setRequired(false)),

  async execute(interaction) {
    // Initialize targetUser as the command sender
    let targetUser = interaction.user;

    try {
      // Determine the target user using the optional interaction option
      targetUser = interaction.options.getUser('target') || interaction.user;

      // Get the avatar URL with size and dynamic image support
      const avatarURL = targetUser.displayAvatarURL({
        size: 1024,
        dynamic: true,
      });

      // Ensure we have a valid user before proceeding
      if (!avatarURL) {
        throw new Error('Could not find a valid user.');
      }

      // Create the embed with the avatar
      const avatarEmbed = new EmbedBuilder()
        .setTitle(`${targetUser.username}'s Avatar`) // Display the user's name
        .setURL(avatarURL) // Make the image clickable
        .setImage(avatarURL) // Embed the avatar
        .setColor('#275BF0') // Custom color
        .setFooter({
          text: `Requested by ${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        }) // Additional footer info
        .setTimestamp(); // Time-stamp for when the command was used

      // Send the embed to the channel
      await interaction.reply({ embeds: [avatarEmbed] });

    } catch (error) {
      // Handle errors gracefully
      console.error(`Error fetching avatar: ${error}`);
      await interaction.reply(`**Whoops!** Couldn't fetch avatar. ${error.message}`);
    }
  },
};