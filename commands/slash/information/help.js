const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { Collection } = require('discord.js');
const fs = require('node:fs');
module.exports = {
    category: 'information',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get detailed information about bot commands.')
        .addStringOption(option =>
            option
                .setName('command')
                .setDescription('Specific command to get detailed information on')
                .setRequired(false)
        ),
    async execute(interaction) {
        const { commands } = interaction.client;
        const commandName = interaction.options.getString('command');

        if (commandName) {
            const command = commands.get(commandName);

            if (!command) {
                return interaction.reply({
                    content: 'That command does not exist.',
                    ephemeral: false
                });
            }

            const helpEmbed = new EmbedBuilder()
                .setTitle(`Help for /${command.data.name}`)
                .setDescription(command.data.description)
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Usage', value: `/${command.data.name} ${command.data.options.map(opt => `[${opt.name}:${opt.description}]`).join(' ')}`, inline: false },
                    { name: 'Category', value: command.category || 'General', inline: false }
                );

            return interaction.reply({
                embeds: [helpEmbed],
                ephemeral: false
            });
        }

        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setDescription('Here are all available commands sorted by category:')
            .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }));        const categories = new Collection();

            commands.forEach((cmd) => {
                const category = cmd.category || 'General';
                if (category !== 'developer') {  // Exclude the 'developer' category
                    if (!categories.has(category)) {
                        categories.set(category, []);
                    }
                    categories.get(category).push(cmd.data.name);
                }
            });
    
            categories.forEach((commands, category) => {
                embed.addFields({
                    name: category,
                    value: commands.map(name => `\`${name}\``).join(', '),
                    inline: false
                });
            });
    
            await interaction.reply({
                embeds: [embed],
                ephemeral: false
            });
    
            setTimeout(async () => {
                await interaction.editReply({
                   content: 'Context menu timeout. Categories are now divided.',
                   embeds: [embed],
                   ephemeral: false
                });
            }, 120000); // 2 minutes timeout
        }
    };
    
    // Add category to each command for better sorting
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        client.commands.set(command.data.name, { ...command,
            category: file.split('.')[0] !== 'developer' ? file.split('.')[0] : 'General' // Categorize without 'developer'
        });
    }