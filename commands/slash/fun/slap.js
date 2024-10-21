const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { giphy_api_key } = require('../../../config.js');
module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('slap')
        .setDescription('Slap someone virtually!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to slap')
                .setRequired(true)),
    async execute(interaction) {
        const fetch = await import('node-fetch').then(mod => mod.default);

        const target = interaction.options.getUser('target');

        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: `Why would you slap yourself, ${interaction.user.username}? 🤔`,
                ephemeral: true
            });
        }

        const messages = [
            `${interaction.user.username} just slapped ${target.username} really hard! Ouch!`,
            `Watch out! ${interaction.user.username} slapped ${target.username}!`,
            `Bam! ${target.username} got a slap from ${interaction.user.username}!`,
            `That must've hurt! ${interaction.user.username} slapped ${target.username}!`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Fetch a random slap gif from Giphy API
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=anime%20slap&limit=1`);
        const json = await response.json();
        const gifUrl = json.data?.[0]?.images?.original?.url;

        if (!gifUrl) {
            console.error("Failed to fetch gif URL from Giphy API:", json);
            return interaction.reply({
                content: `Couldn't fetch a slap gif, but ${randomMessage}.`,
                ephemeral: true
            });
        }

        // Create Embed
        const slapEmbed = new EmbedBuilder()            .setColor('#FF0000')
        .setTitle('Slap!')
        .setDescription(randomMessage)
        .setImage(gifUrl)
        .setFooter({ text: 'Slam those slaps!' });

    await interaction.reply({ content: `Hey ${target}!`, embeds: [slapEmbed] });
},
};