const fs = require('node:fs');
const path = require('node:path')
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('././config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
client.commands = new Collection();
client.cooldowns = new Collection();

client.once('ready', () => {
  console.log(`Logged in as ${client.user ? client.user.tag : 'Unknown'}!`);

  // Make sure client.user is not null
  if (client.user) {
    try {
      client.user.setStatus('dnd'); // or whichever status you'd prefer
      console.log('Status set to DND');
    } catch (error) {
      console.error('Error setting status:', error);
    }
  } else {
    console.error('client.user is null. Unable to set status.');
  }
});
// Load slash commands
const slashCommandsPath = path.join(__dirname, 'commands/slash');
const slashCommandFolders = fs.readdirSync(slashCommandsPath);

for (const folder of slashCommandFolders) {
  const commandsPath = path.join(slashCommandsPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[+] Slash command "${command.data.name}" loaded.`);
    } else {
      console.log(`[!] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}
// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
const event = require(path.join(eventsPath, file));
if (event.once) {
  client.once(event.name, (...args) => event.execute(...args, client));
} else {
  client.on(event.name, (...args) => event.execute(...args, client));
}
}

// Import the prefix command handler (messageCreate.js) if it's not already handled in eventFiles
// Log in to Discord
client.login(token);