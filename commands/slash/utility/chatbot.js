const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, GatewayIntentBits } = require('discord.js');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, } = require('@google/generative-ai');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));  // node-fetch is ESM only
const {token , gemini_api_key } = require('../../../config.js'); // Ensure the path to your config is correct

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let chatbotEnabledChannels = new Set();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}! Chatbot is ready to roll out.`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'chatbot') {
        const status = interaction.options.getString('option');
        const channelId = interaction.channelId;

        try {
            if (status === 'activate') {
                if (chatbotEnabledChannels.has(channelId)) {
                    await interaction.reply(`Chatbot is already **activated** in this channel.`);
                } else {
                    chatbotEnabledChannels.add(channelId);
                    await interaction.reply(`Chatbot has been **activated** in this channel.`);
                }
            } else if (status === 'deactivate') {
                if (!chatbotEnabledChannels.has(channelId)) {
                    await interaction.reply(`Chatbot is already **deactivated** in this channel.`);
                } else {
                    chatbotEnabledChannels.delete(channelId);
                    await interaction.reply(`Chatbot has been **deactivated** in this channel.`);
                }
            }
        } catch (error) {
            console.error(error);
            await interaction.reply(`Oops, ran into a snag: ${error.message}`);        }
        }
    });
    client.on('messageCreate', async message => {
      if (message.author.bot || !chatbotEnabledChannels.has(message.channelId)) return;
    
      try {
        const response = await generateResponse(message.content);
        if (response) {
          await message.reply(response).catch(console.error);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
    
    async function generateResponse(prompt) {
      const genAI = new GoogleGenerativeAI(gemini_api_key);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b-exp-0924",
      });
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192
      }; 
      try {
        const result = await model.generateContent(
          prompt, {generationConfig});
        return result.response.text();
      } catch (error) {
        console.error('Error generating response:', error);
        return "Hmm... couldn't think of a response. Try me again later?";
      }
    }
    client.login(token);
    
    module.exports = {
        category: 'utility',
        data: new SlashCommandBuilder()
            .setName('chatbot')
            .setDescription('Toggle chatbot on or off in this channel.')
            .addStringOption(option =>
                option
                    .setName('option')
                    .setDescription('Activate or deactivate the chatbot')
                    .setRequired(true)
                    .addChoices(
                        { name: 'activate', value: 'activate' },
                        { name: 'deactivate', value: 'deactivate' }
                    )
            ),
        async execute(interaction) {
            // The interaction handling is already taken care of in `interactionCreate` event
        }
    };