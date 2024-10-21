const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
category: 'moderation',
data: new SlashCommandBuilder()
.setName('unmute')
.setDescription('Unmute a user in the server.')
.addStringOption(option =>
option.setName('userid')
.setDescription('The ID of the user to unmute')
.setRequired(false))
.addUserOption(option =>
option.setName('user')
.setDescription('The user to unmute from the list')
.setRequired(false)),
 
async execute(interaction) {
const userId = interaction.options.getString('userid');
const userOption = interaction.options.getUser('user');

if ((!userId && !userOption) || (userId && userOption)) {
return await interaction.reply({ content: 'You must provide either a User ID or select a user, not both.', ephemeral: true });
}

await interaction.deferReply({ ephemeral: false });

if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
return await interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
}
 
try {
const user = userOption || await interaction.client.users.fetch(userId.trim());
const member = await interaction.guild.members.fetch(user.id);

if (!member) {
return await interaction.editReply({ content: `User ${user.tag} not found.`, ephemeral: true });
}
 
await member.timeout(null);

const embed = new EmbedBuilder()
.setColor(0x00ff00)
.setTitle('User Unmuted')
.setDescription(`Successfully unmuted <@${user.id}>.`)
.setTimestamp()
.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 128 }));

await interaction.editReply({ embeds: [embed] });
} catch (error) {
const embed = new EmbedBuilder()
.setColor(0xff0000)
.setTitle('Error')
.setDescription(`Failed to unmute user: ${error.message}`)
.setTimestamp();

await interaction.editReply({ embeds: [embed], ephemeral: true });
console.error('Error unmuting user:', error);
}
},
};