const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Paths and other configurations (adjust as necessary)
const { giphy_api_key } = require('../../../config');

module.exports = {
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('wave')
    .setDescription('Send a wave to someone!')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('The user you want to wave')
        .setRequired(true)),
  async execute(interaction) {
    const fetch = await import('node-fetch').then(mod => mod.default);

    const target = interaction.options.getUser('target');

    const messages = [
      `${interaction.user.username} is waving you, ${target.username}! Respect!`,
      `See here! ${interaction.user.username} waved ${target.username}!`,
      `${interaction.user.username} gives a formal wave to you, ${target.username}!`,
      `Honor and respect! ${target.username} received a wave from ${interaction.user.username}!`,
      `${interaction.user.username} shows their respect by waving ${target.username}!`,
      `A distinguished wave from ${interaction.user.username} to ${target.username}!`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    try {
      // Fetch a random salute gif from Giphy API
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=wave%20kitty&limit=1`);
      const json = await response.json();
      const gifUrl = json.data?.[0]?.images?.original?.url;

      if (!gifUrl) {
        throw new Error("Failed to fetch gif URL from Giphy API");
      }

      // Create Embed
      const waveEmbed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('WAVE!')
        .setDescription(randomMessage)
        .setImage(gifUrl)
        .setFooter({ text: 'wave sent successfully!' });

      await interaction.reply({
        content: `Hey ${target}!`,        embeds: [waveEmbed]
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