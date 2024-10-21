const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { giphy_api_key } = require('../../../config.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Give someone a virtual pat!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to pat')
                .setRequired(true)),
    async execute(interaction) {
        const fetch = await import('node-fetch').then(mod => mod.default);
        const target = interaction.options.getUser('target');

        // Prevent the user from patting themselves
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: `Patting yourself, ${interaction.user.username}? That's adorable! 🐱`,
                ephemeral: true
            });
        }

        // Random messages to accompany the pat
        const messages = [
            `${interaction.user.username} just gave ${target.username} a gentle pat! 🐱`,
            `A comforting pat from ${interaction.user.username} to ${target.username}! 🖐️`,
            `${target.username} received a pat from ${interaction.user.username}! 🥰`,
            `${interaction.user.username} pats ${target.username} softly! 🐾`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Fetching pat GIF from Giphy
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=anime%20pat&limit=1`);
        const json = await response.json();
        const gifUrl = json.data?.[0]?.images?.original?.url;

        // If no GIF is found, reply with a plain message
        if (!gifUrl) {
            return interaction.reply({
                content: `Couldn't fetch a pat gif, but ${randomMessage}.`,
                ephemeral: true
            });
        }        // Create an embed with the pat GIF and random message
        const patEmbed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('Pat!')
            .setDescription(randomMessage)
            .setImage(gifUrl)
            .setFooter({ text: 'There, there!' });

        // Reply with the embed
        await interaction.reply({ content: `Hey ${target.username}!`, embeds: [patEmbed] });
    },
};