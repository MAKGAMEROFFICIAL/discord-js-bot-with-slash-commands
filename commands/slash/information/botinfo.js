const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    cooldown: 5,
    category: 'information',
data: new SlashCommandBuilder()
.setName('botinfo')
.setDescription('Displays stats and information about the bot.')
.addSubcommand(subcommand =>
subcommand
.setName('stats')
.setDescription('Displays stats and information about the bot.')),

async execute(interaction) {
try {
// Gather stats
const uptime = moment.duration(interaction.client.uptime).humanize();
const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
const totalGuilds = interaction.client.guilds.cache.size;
const totalUsers = interaction.client.users.cache.size;
const totalChannels = interaction.client.channels.cache.size;
const totalCommands = interaction.client.commands.size;
const botLibrary = 'discord.js'; // Add the bot library info here

// Create the embed with the bot's stats
const botInfoEmbed = new EmbedBuilder()
.setTitle('Bot Information')
.setColor('#275BF0')
.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
.addFields(
{ name: 'Uptime', value: uptime, inline: true },
{ name: 'Memory Usage', value: `${memoryUsage} MB`, inline: true },
{ name: 'Servers', value: `${totalGuilds}`, inline: true },
{ name: 'Users', value: `${totalUsers}`, inline: true },
{ name: 'Channels', value: `${totalChannels}`, inline: true },
{ name: 'Total Commands', value: `${totalCommands}`, inline: true },
{ name: 'Library', value: botLibrary, inline: true } // Add this line for library info
)
.setFooter({
text: `Requested by ${interaction.user.username}`,
iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
})
.setTimestamp(); // Time-stamp when the command was used

// Send the embed to the channel
await interaction.reply({ embeds: [botInfoEmbed] });

} catch (error) {
// Handle errors gracefully
console.error(`Error fetching bot stats: ${error}`);
await interaction.reply(`**Yikes!** Couldn't fetch bot stats. ${error.message}`);
}
},
};