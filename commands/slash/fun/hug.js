const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { giphy_api_key } = require('../../../config.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Send a heartfelt hug to someone!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to hug')
                .setRequired(true)),
    async execute(interaction) {
        const fetch = await import('node-fetch').then(mod => mod.default);
        const target = interaction.options.getUser('target');

        // Prevent the user from hugging themselves
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: `Hugging yourself, ${interaction.user.username}? That's a big self-love hug! 🤗`,
                ephemeral: true
            });
        }

        // Random messages to accompany the hug
        const messages = [
            `${interaction.user.username} gives ${target.username} a big, warm hug! 🤗`,
            `A cozy hug from ${interaction.user.username} to ${target.username}! 💞`,
            `${target.username}, you just received a hug from ${interaction.user.username}! 🫂`,
            `${interaction.user.username} wraps around ${target.username} for a snug hug! 🤗`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Fetching hug GIF from Giphy
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=anime%20hug&limit=1`);
        const json = await response.json();
        const gifUrl = json.data?.[0]?.images?.original?.url;

        // If no GIF is found, reply with a plain message
        if (!gifUrl) {
            return interaction.reply({
                content: `Couldn't fetch a hug gif, but ${randomMessage}.`,
                ephemeral: true            });
            }
    
            // Create an embed with the hug GIF and random message
            const hugEmbed = new EmbedBuilder()
                .setColor('#FF69B4')
                .setTitle('Hug!')
                .setDescription(randomMessage)
                .setImage(gifUrl)
                .setFooter({ text: 'Spread the warmth!' });
    
            // Reply with the embed
            await interaction.reply({ content: `Hey ${target}!`, embeds: [hugEmbed] });
        },
    };