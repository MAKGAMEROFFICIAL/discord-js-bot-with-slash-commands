const { Events, Collection } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Slash Command Handling
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`[x] No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        // Prevent multiple replies or follow-ups
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: "[!] There was an error while executing this command!",
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: "[!] There was an error while executing this command!",
            ephemeral: true,
          });
        }
      }

      // Call the cooldown handler after ensuring only one reply
      await handleCooldown(interaction, command);
    }
  },
};

// Prefix Command Handling
module.exports.messageHandler = async (message) => {
  const prefix = "!"; // Set your desired prefix
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = message.client.commands.get(commandName);

  if (!command) {
    console.error(`[x] No command matching ${commandName} was found.`);
    return;
  }

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("[!] There was an error while executing this command!");
  }

  // Call the cooldown handler
  await handleCooldown(message, command);
};

// Cooldown Logic
async function handleCooldown(source, command) {
  const { client, user } = source;
  const { cooldowns } = client;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const defaultCooldownDuration = 3; // default cooldown in seconds
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(user.id)) {
    const expirationTime = timestamps.get(user.id) + cooldownAmount;
    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);

      // Check if it's a Chat Input Command or a message command
      if (!source.replied && !source.deferred) {
        if (source.isChatInputCommand && typeof source.isChatInputCommand === "function") {
          // Chat input command (slash command)
          await source.reply({
            content: `Please wait, you are on a cooldown for \`${command.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
          });
        } else {
          // Prefix command (message command)
          await source.channel.send({
            content: `Please wait, you are on a cooldown for \`${command.name}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          });
        }
      }

      return;
    }
  }

  timestamps.set(user.id, now);
  setTimeout(() => timestamps.delete(user.id), cooldownAmount);
}
