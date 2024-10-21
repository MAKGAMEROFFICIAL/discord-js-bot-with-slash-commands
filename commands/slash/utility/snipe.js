const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, Collection } = require('discord.js');

/* Create a collection to store deleted messages for sniping */
let deletedMessages = new Collection();

module.exports = {
category: 'utility',
data: new SlashCommandBuilder()
.setName('snipe')
.setDescription('Shows the deleted messages in the channel.')
.addIntegerOption(option =>
option.setName('amount')
.setDescription('Number of deleted messages to snipe (up to 10)')
.setRequired(false)),

async execute(interaction) {
const amount = interaction.options.getInteger('amount') || 1;

/* Fetch the last `amount` deleted messages from the collection */
const snipedMessages = deletedMessages.get(interaction.channel.id) || [];

if (snipedMessages.length === 0 || amount > snipedMessages.length) {
return interaction.reply({
content: 'No recently deleted messages in this channel or the amount requested exceeds the number of available messages.',
ephemeral: true
});
}

/* Limit the amount to a maximum of 10 */
const snipesToShow = snipedMessages.slice(0, Math.min(amount, 10));
const embeds = snipesToShow.map((msg, index) => {
return new EmbedBuilder()
.setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
.setDescription(msg.content || '*Message content missing*')
.setTimestamp(msg.createdAt)
.setFooter({ text: `Message ${index + 1} of ${snipesToShow.length} deleted` });
});

/* Respond with the embeds */
await interaction.reply({ embeds: embeds });
}
};

/* Listen for deleted messages and store them in the collection */
module.exports.registerEvent = (client) => {
client.on('messageDelete', message => {
/* Initialize the channel's array if it doesn't exist yet */
if (!deletedMessages.has(message.channel.id)) {
deletedMessages.set(message.channel.id, []);
}

/* Add the deleted message to the beginning of the channel's array */
deletedMessages.get(message.channel.id).unshift({
author: message.author,content: message.content,
createdAt: message.createdAt
});

/* Keep only the last 10 deleted messages in the array */
deletedMessages.set(message.channel.id, deletedMessages.get(message.channel.id).slice(0, 10));

/* Remove the deleted message from the collection after 7 days to prevent memory leaks */
setTimeout(() => {
const snipes = deletedMessages.get(message.channel.id) || [];
if (snipes.length) snipes.pop();
if (!snipes.length) deletedMessages.delete(message.channel.id);
else deletedMessages.set(message.channel.id, snipes);
}, 7 * 24 * 3600000); // 7 days in milliseconds
});
};