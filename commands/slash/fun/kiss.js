const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { giphy_api_key } = require('../../../config.js');

module.exports = {
    category: 'fun',
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Send a virtual kiss to someone!')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user you want to kiss')
                .setRequired(true)
        ),
    async execute(interaction) {
        const fetch = await import('node-fetch').then(mod => mod.default);
        const target = interaction.options.getUser('target');

        // Prevent the user from kissing themselves (and provide a fun response)
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: `Sending a kiss to yourself, ${interaction.user.username}? That's some self-love! 😘`,
                ephemeral: true
            });
        }

        // Random messages to accompany the kiss
        const messages = [
            `${interaction.user.username} just sent a sweet kiss to ${target.username}! 😘`,
            `A lovely kiss from ${interaction.user.username} to ${target.username}! 💋`,
            `${target.username}, you got a kiss from ${interaction.user.username}! 💓`,
            `${interaction.user.username} blows a kiss to ${target.username}! 😘`
        ];

        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        // Fetching kiss GIF from Giphy
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphy_api_key}&q=anime%20kiss&limit=1`);
        const json = await response.json();
        const gifUrl = json.data?.[0]?.images?.original?.url;
        
        // If no GIF is found, reply with a plain message
        if (!gifUrl) {
            return interaction.reply({                content: `Couldn't fetch a kiss gif, but ${randomMessage}.`,
                ephemeral: true
            });
        }

        // Create an embed with the kiss GIF and random message
        const kissEmbed = new EmbedBuilder()
            .setColor('#FF69B4')
            .setTitle('Kiss!')
            .setDescription(randomMessage)
            .setImage(gifUrl)
            .setFooter({ text: 'Spread the love!' });

        // Reply with the embed
        await interaction.reply({ content: `Hey ${target}!`, embeds: [kissEmbed] });
    },
};