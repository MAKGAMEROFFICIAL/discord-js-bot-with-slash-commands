const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server.')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to ban')
                .setRequired(false)) // make it optional so the choice is clear
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Select a user to ban from the list')
                .setRequired(false)) // also optional
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(false))
        .addIntegerOption(option =>
            option.setName('days')
                .setDescription('Number of days of messages to delete (0-7)')
                .setRequired(false)),
        
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        const userOption = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || `Banned by ${interaction.user.tag}`;
        const days = interaction.options.getInteger('days') || 0;

        if (!userId && !userOption) {
            return await interaction.reply({ content: 'You must provide either a User ID or select a user.', ephemeral: true });
        }
        
        if ((userId && userOption)) {
            return await interaction.reply({ content: 'You must provide either a User ID or select a user, not both.', ephemeral: true });
        }

        // Defer the reply to prevent the interaction from timing out
        await interaction.deferReply({ ephemeral: false });

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {            return await interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    try {
        const user = userOption || await interaction.client.users.fetch(userId.trim());
        await interaction.guild.members.ban(user.id, { days, reason });

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('User Banned')
            .setDescription(`Successfully banned <@${user.id}>.
**reason:** ${reason}
**Messages deleted for:** ${days} days`)
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }));

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Error')
            .setDescription(`Failed to ban user: ${error.message}`)
            .setTimestamp();

        await interaction.editReply({ embeds: [embed], ephemeral: true });
        console.error('Error banning user:', error);
    }
},
};