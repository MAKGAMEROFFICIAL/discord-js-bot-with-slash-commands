const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Paths and other configurations (adjust as necessary)
const { giphy_api_key } = require('../../../config.js');

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('salute')
    .setDescription('Send a salute to someone!')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want to salute')
        .setRequired(true)),
  async execute(interaction) {
    const fetch = await import('node-fetch').then(mod => mod.default);

    const target = interaction.options.getUser('target');

    const messages = [
      `${interaction.user.username} is saluting you, ${target.username}! Respect!`,
      `Stand tall! ${interaction.user.username} saluted ${target.username}!`,
      `${interaction.user.username} gives a formal salute to you, ${target.username}!`,
      `Honor and respect! ${target.username} received a salute from ${interaction.user.username}!`,
      `${interaction.user.username} shows their respect by saluting ${target.username}!`,
      `A distinguished salute from ${interaction.user.username} to ${target.username}!`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    try {
      // Fetch a random salute gif from Giphy API
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=anime%20salute&limit=1`);
      const json = await response.json();
      const gifUrl = json.data?.[0]?.images?.original?.url;

      if (!gifUrl) {
        throw new Error("Failed to fetch gif URL from Giphy API");
      }

      // Create Embed
      const saluteEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('Salute!')
        .setDescription(randomMessage)
        .setImage(gifUrl)
        .setFooter({ text: 'Salute performed successfully!' });

      await interaction.reply({
        content: `Hey ${target}!`,        embeds: [saluteEmbed]
    });

  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: `Couldn't fetch a salute gif, but ${randomMessage}.`,
      ephemeral: true
    });
  }
},
};