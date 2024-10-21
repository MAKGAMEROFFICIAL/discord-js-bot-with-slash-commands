const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
category: 'management',
data: new SlashCommandBuilder()
.setName('unhide')
.setDescription('Unhides a channel, allowing members to view it')
.addChannelOption(option =>
option.setName('channel')
.setDescription('The channel to unhide')
.setRequired(false)
),
async execute(interaction) {
const channel = interaction.options.getChannel('channel') || interaction.channel;

if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
return interaction.reply({ content: 'You do not have permission to unhide channels.', ephemeral: true });
}

try {
const everyoneRole = interaction.guild.roles.everyone;

// Update permissions to allow viewing the channel
await channel.permissionOverwrites.edit(everyoneRole, {
[PermissionsBitField.Flags.ViewChannel]: true
});

return interaction.reply({ content: `${channel} has been unhidden.`, ephemeral: false });
} catch (error) {
console.error(error);
return interaction.reply({ content: 'There was an error trying to unhide this channel.', ephemeral: true });
}
}
};