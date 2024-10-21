const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
category: 'management',
data: new SlashCommandBuilder()
.setName('lockall')
.setDescription('Locks all channels, preventing members from sending messages'),
async execute(interaction) {

if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
return interaction.reply({ content: 'You do not have permission to lock channels.', ephemeral: true });
}

try {
const everyoneRole = interaction.guild.roles.everyone;

// Fetch channels with correct type checks
const channels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildNews);

for (const channel of channels.values()) {
await channel.permissionOverwrites.edit(everyoneRole, {
[PermissionsBitField.Flags.SendMessages]: false
});
}

return interaction.reply({ content: 'All channels have been locked.', ephemeral: false });
} catch (error) {
console.error(error);
return interaction.reply({ content: 'There was an error trying to lock all channels.', ephemeral: true });
}
}
};