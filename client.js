const { Client, GatewayIntentBits } = require('discord.js'); // Assuming you forgot to import these.

// Create a new client instance with the necessary intents.
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
});
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}! It's hero time!`);
    db = await openDb();
    await db.exec('CREATE TABLE IF NOT EXISTS settings (guildId TEXT PRIMARY KEY, prefix TEXT)');
    client.user.setStatus('dnd');
    client.login(token);
    console.log(`Database and bot ready! The bot owner is ID ${BOT_OWNER_ID}`);})