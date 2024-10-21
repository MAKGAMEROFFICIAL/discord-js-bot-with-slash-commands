const { SlashCommandBuilder } = require('discord.js');
const { ownerId } = require('../../../config');

module.exports = {
category: 'developer',
data: new SlashCommandBuilder()
.setName('reload')
.setDescription('Reloads a command.')
.addStringOption(option =>
option.setName('command')
.setDescription('The command to reload.')
.setRequired(true)),
async execute(interaction) {
const commandName = interaction.options.getString('command', true).toLowerCase();
const command = interaction.client.commands.get(commandName);

if (!command) {
return interaction.reply({ content: `[!] There is no command with the name \`${commandName}\`!`, ephemeral: true });
}

if (ownerId.includes(interaction.user.id)) {
delete require.cache[require.resolve(`../${command.category}/${command.data.name}.js`)];

try {
interaction.client.commands.delete(command.data.name);
const newCommand = require(`../${command.category}/${command.data.name}.js`);
interaction.client.commands.set(newCommand.data.name, newCommand);
await interaction.reply({ content: `[+] Command \`${newCommand.data.name}\` was reloaded.`, ephemeral: true });
} catch (error) {
console.error(error);
await interaction.reply({ content: `[!] There was an error while reloading the command \`${command.data.name}\`:
\`${error.message}\``, ephemeral: true });
}
} else {
await interaction.reply({ content: `[-] You are not authorized to do this.`, ephemeral: true });
}
},
};