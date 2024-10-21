const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
category: 'management',
data: new SlashCommandBuilder()
.setName('hide')
.setDescription('Hides a channel, preventing members from viewing it')
.addChannelOption(option =>
option.setName('channel')
.setDescription('The channel to hide')
.setRequired(false)
),
async execute(interaction) {
const channel = interaction.options.getChannel('channel') || interaction.channel;

if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
return interaction.reply({ content: 'You do not have permission to hide channels.', ephemeral: true });
}

try {
const everyoneRole = interaction.guild.roles.everyone;

// Update permissions to prevent viewing the channel
await channel.permissionOverwrites.edit(everyoneRole, {
[PermissionsBitField.Flags.ViewChannel]: false
});

return interaction.reply({ content: `${channel} has been hidden.`, ephemeral: false });
} catch (error) {
console.error(error);
return interaction.reply({ content: 'There was an error trying to hide this channel.', ephemeral: true });
}
}
};