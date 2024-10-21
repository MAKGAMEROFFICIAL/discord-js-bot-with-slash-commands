const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { giphy_api_key } = require('../../../config.js');
module.exports = {
category: 'fun',
data: new SlashCommandBuilder()
.setName('punch')
.setDescription('Punch someone virtually!')
.addUserOption(option =>
option.setName('target')
.setDescription('The user you want to punch')
.setRequired(true)),
async execute(interaction) {
const fetch = await import('node-fetch').then(mod => mod.default);
const target = interaction.options.getUser('target');

// Prevent the user from punching themselves
if (target.id === interaction.user.id) {
return interaction.reply({
content: `Why would you punch yourself, ${interaction.user.username}? 🤔`,
ephemeral: true
});
}

// Random messages to accompany the punch
const messages = [
`${interaction.user.username} just punched ${target.username} really hard! Pow!`,
`Watch out! ${interaction.user.username} punched ${target.username}!`,
`Bam! ${target.username} got a punch from ${interaction.user.username}!`,
`That must've hurt! ${interaction.user.username} punched ${target.username}!`
];

const randomMessage = messages[Math.floor(Math.random() * messages.length)];

// Fetching punch GIF from Giphy
const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=anime%20punch&limit=1`);
const json = await response.json();
const gifUrl = json.data?.[0]?.images?.original?.url;

// If no GIF is found, reply with a plain message
if (!gifUrl) {
return interaction.reply({
content: `Couldn't fetch a punch gif, but ${randomMessage}.`,
ephemeral: true
});
}

// Create an embed with the punch GIF and random message
const punchEmbed = new EmbedBuilder()
.setColor('#FF0000')
.setTitle('Punch!')
.setDescription(randomMessage)
.setImage(gifUrl)
.setFooter({ text: 'Punch it up!' });

// Reply with the embed
await interaction.reply({ content: `Hey ${target.username}!`, embeds: [punchEmbed] });
},
};