const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  cooldown: 5,
  category: 'information',
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Responds with the client's ping!"),

  async execute(interaction) {
    // Initial response
    await interaction.reply({ content: 'Pinging...', ephemeral: false });
    await wait(2000);

    // Calculate the ping
    const latency = Date.now() - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    // Determine embed color based on latency
    const getPingColor = (latency) => {
      if (latency < 100) return '#00FF00'; // Green for good ping
      if (latency < 200) return '#FFFF00'; // Yellow for moderate ping
      return '#FF0000'; // Red for high ping
    };

    // Create the embed
    const embed = new EmbedBuilder()
      .setColor(getPingColor(latency))
      .setTitle('Pong! 🏓')
      .setDescription(`Latency is \`${latency}ms\`
API Latency is \`${apiLatency}ms\``)
      .setThumbnail(interaction.client.user.displayAvatarURL())
      .addFields(
        { name: 'Server Ping', value: `${latency}ms`, inline: true },
        { name: 'Shard Ping', value: `${apiLatency}ms`, inline: true },
      )
      .setFooter({ text: 'This is a unique and advanced ping response!' })
      .setTimestamp();

    // Edit initial response with the embed
    await interaction.editReply({ content: null, embeds: [embed], ephemeral: false });
  }
};