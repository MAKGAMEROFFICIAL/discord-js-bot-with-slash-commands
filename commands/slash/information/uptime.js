const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    category: 'information',
    data: new SlashCommandBuilder()
        .setName('uptime')
        .setDescription('Displays the bot uptime in style with some alien magic!'),

    async execute(interaction) {
        const totalSeconds = (interaction.client.uptime / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor(totalSeconds / 3600) % 24;
        const minutes = Math.floor(totalSeconds / 60) % 60;
        const seconds = Math.floor(totalSeconds % 60);

        const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🚀 Uptime Info 🚀')
            .setDescription(`The bot has been online for \`${uptime}\``)
            .addFields(
                { name: 'Days', value: `${days}`, inline: true },
                { name: 'Hours', value: `${hours}`, inline: true },
                { name: 'Minutes', value: `${minutes}`, inline: true },
                { name: 'Seconds', value: `${seconds}`, inline: true },
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: '🔥 Keeping the hero watch! 🔥' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};