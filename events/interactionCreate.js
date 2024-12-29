const { Events, Collection } = require("discord.js");
module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Slash Command Handling
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(interaction.commandName);

      if (!command) {
        console.error(`[x] No slash command matching ${interaction.commandName} was found.`);
        return await interaction.reply({ content: "That command couldn't be found.", ephemeral: true });
      }

      try {
        await command.execute(interaction);
        await handleCooldown(interaction, command);
      } catch (error) {
        console.error(`Error executing slash command ${interaction.commandName}:`, error);
        await handleCommandError(interaction, error);
      }
    }
  },
};

// Prefix Command Handling
module.exports.messageHandler = async (message, client) => {
  const { prefix } = require('../functions/prefix');
  if (!message.content.startsWith(prefix) || message.author.bot || !message.guild) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.prefixCommands.get(commandName) || client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) {
    console.error(`[x] No prefix command matching ${commandName} was found.`);
    return;
  }

  try {
    await command.execute(message, args, client);
    await handleCooldown(message, command);
  } catch (error) {
    console.error(`Error executing prefix command ${commandName}:`, error);
    await message.reply("[!] There was an error while executing this command!");
  }
};

// Utility function for handling errors in commands
async function handleCommandError(interaction, error) {
  const errorMessage = "[!] There was an error while executing this command!";
  try {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: errorMessage,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: errorMessage,
        ephemeral: true,
      });
    }
  } catch (replyError) {
    console.error(`Error sending error message for ${interaction.commandName}:`, replyError);
  }
}

// Cooldown Logic
async function handleCooldown(source, command) {
  const { client, user } = source;
  const { cooldowns } = client;

  // Determine the command name based on whether it's a slash or prefix command
  const commandName = command.data ? command.data.name : command.name;

  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(commandName);
  const defaultCooldownDuration = 3; // default cooldown in seconds
  const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

  if (timestamps.has(user.id)) {
    const expirationTime = timestamps.get(user.id) + cooldownAmount;
    if (now < expirationTime) {
      const expiredTimestamp = Math.round(expirationTime / 1000);

      try {
        if (source.isChatInputCommand && typeof source.isChatInputCommand === "function") {
          // Slash command
          await source.reply({
            content: `Please wait, you are on a cooldown for \`${commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`,
            ephemeral: true,
          });
        } else {
          // Prefix command
          await source.channel.send({
            content: `Please wait, you are on a cooldown for \`${commandName}\`. You can use it again <t:${expiredTimestamp}:R>.`,
          });
        }
      } catch (replyError) {
        console.error(`Error applying cooldown for ${commandName} to ${user.tag}:`, replyError);
      }

      return;
    }
  }

  timestamps.set(user.id, now);
  setTimeout(() => timestamps.delete(user.id), cooldownAmount);
}