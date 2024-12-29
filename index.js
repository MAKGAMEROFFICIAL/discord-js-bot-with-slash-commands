const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token, clientId } = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences, // Required for bot presence
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping
  ],
});
// Separate collections for slash and prefix commands
client.slashCommands = new Collection();
client.cooldowns = new Collection();

const eventsPath = path.join(__dirname, "events");
const slashCommandsPath = path.join(__dirname, "commands", "slash");
const prefixCommandsPath = path.join(__dirname, "commands", "prefix");

// Load events
try {
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));
  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
} catch (error) {
  console.error("Error loading events:", error);
}

// Load slash commands
try {
  const slashCommandFolders = fs.readdirSync(slashCommandsPath);
  for (const folder of slashCommandFolders) {
    const commandsPath = path.join(slashCommandsPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if (command.data?.name && command.execute) {
        client.slashCommands.set(command.data.name, command);
        console.log(`[+] Slash command "${command.data.name}" loaded.`);
      } else {
        console.log(`[!] Invalid slash command at ${filePath}`);
      }
    }
  }
} catch (error) {
  console.error("Error loading slash commands:", error);
}

client.login(token).catch((error) => {
  console.error("Error logging in to Discord:", error);
});