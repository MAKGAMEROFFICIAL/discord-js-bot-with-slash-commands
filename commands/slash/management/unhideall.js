const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, ChannelType } = require('discord.js');

module.exports = {
category: 'management',
data: new SlashCommandBuilder()
.setName('unhideall')
.setDescription('Unhides all channels, allowing members to view them'),
async execute(interaction) {

if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
return interaction.reply({ content: 'You do not have permission to unhide channels.', ephemeral: true });
}

try {
const everyoneRole = interaction.guild.roles.everyone;
const channels = interaction.guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);

for (const channel of channels.values()) {
await channel.permissionOverwrites.edit(everyoneRole, {
[PermissionsBitField.Flags.ViewChannel]: true
});
}

return interaction.reply({ content: 'All channels have been unhidden.', ephemeral: false });
} catch (error) {
console.error(error);
return interaction.reply({ content: 'There was an error trying to unhide all channels.', ephemeral: true });
}
}
};