const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v9');
const { EmbedBuilder } = require('discord.js');

module.exports = {
category: 'moderation',
data: new SlashCommandBuilder()
.setName('roleremove')
.setDescription('Remove a role from a user')
.addUserOption(option =>
option.setName('user')
.setDescription('The user to remove the role from')
.setRequired(true))
.addRoleOption(option =>
option.setName('role')
.setDescription('The role to remove')
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
await member.roles.remove(role);

const embed = new EmbedBuilder()
.setColor(0x00ff00)
.setTitle('Role Removed')
.setDescription(`Successfully removed the role <@&${role.id}> from <@${user.id}>.`)
.setTimestamp();

await interaction.reply({ embeds: [embed] });
} catch (error) {
const embed = new EmbedBuilder()
.setColor(0xff0000)
.setTitle('Error')
.setDescription(`Failed to remove role: ${error.message}`)
.setTimestamp();

await interaction.reply({ embeds: [embed], ephemeral: true });
console.error('Error removing role:', error);
}
},
};