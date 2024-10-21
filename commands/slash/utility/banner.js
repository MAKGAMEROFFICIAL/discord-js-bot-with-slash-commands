const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'utility',
data: new SlashCommandBuilder()
.setName('banner')
.setDescription("Displays a user's banner.")
.addUserOption(option => option
.setName('target')
.setDescription('The user to get the banner of')
.setRequired(false)),

async execute(interaction) {
// Initialize targetUser as the command sender
let targetUser = interaction.user;

try {
// Determine the target user using the optional interaction option
targetUser = interaction.options.getUser('target') || interaction.user;

// Fetch the user to get details including banner
let user = await interaction.client.users.fetch(targetUser.id, { force: true });

// Extract the banner URL with size and dynamic image support
const bannerURL = user.bannerURL({
size: 1024,
dynamic: true,
});

// Ensure the user has a banner
if (!bannerURL) {
throw new Error(`${targetUser.username} does not have a banner set.`);
}

// Create the embed with the banner
const bannerEmbed = new EmbedBuilder()
.setTitle(`${targetUser.username}'s Banner`) // Display the user's name
.setURL(bannerURL) // Make the image clickable
.setImage(bannerURL) // Embed the banner
.setColor('#275BF0') // Custom color
.setFooter({
text: `Requested by ${interaction.user.username}`,
iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
}) // Additional footer info
.setTimestamp(); // Time-stamp for when the command was used

// Send the embed to the channel
await interaction.reply({ embeds: [bannerEmbed] });

} catch (error) {
// Handle errors gracefully
console.error(`Error fetching banner: ${error}`);
await interaction.reply(`**Oops!** Couldn't fetch the banner. ${error.message}`);
}
},
};