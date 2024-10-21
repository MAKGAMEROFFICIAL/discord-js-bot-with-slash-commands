const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    category: 'moderation',
    data: new SlashCommandBuilder()
        .setName('roleadd')
        .setDescription('Add a role to a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to add the role to')
                .setRequired(true))
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('The role to add')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');

        // Verify Bot Permissions
        if (!interaction.guild.members.cache.get(interaction.client.user.id).permissions.has(PermissionFlagsBits.ManageRoles)) {
            return await interaction.reply({ content: 'I do not have permission to manage roles.', ephemeral: true });
        }

        // Verify User Permissions
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            const member = await interaction.guild.members.fetch(user.id);
            await member.roles.add(role);

            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('Role Added')
                .setDescription(`Successfully added the role <@&${role.id}> to <@${user.id}>.`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setColor(0xff0000)                .setTitle('Error')
                .setDescription(`Failed to add role: ${error.message}`)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });
            console.error('Error adding role:', error);
        }
    },
};