const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
category: 'management',
data: new SlashCommandBuilder()
.setName('unlock')
.setDescription('Unlocks a channel, allowing members to send messages')
.addChannelOption(option =>
option.setName('channel')
.setDescription('The channel to unlock')
.setRequired(false)
),
async execute(interaction) {
const channel = interaction.options.getChannel('channel') || interaction.channel;

if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
return interaction.reply({ content: 'You do not have permission to unlock channels.', ephemeral: true });
}

try {
const everyoneRole = interaction.guild.roles.everyone;

// Update permissions to allow sending messages
await channel.permissionOverwrites.edit(everyoneRole, {
[PermissionsBitField.Flags.SendMessages]: true
});

return interaction.reply({ content: `${channel} has been unlocked.`, ephemeral: false });
} catch (error) {
console.error(error);
return interaction.reply({ content: 'There was an error trying to unlock this channel.', ephemeral: true });
}
}
};