const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
  category: 'utility',
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription("Displays server information"),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: false});
      const guild = interaction.guild;
      const owner = await guild.fetchOwner();
      const verificationLevels = {
        0: 'None',
        1: 'Low',
        2: 'Medium',
        3: 'High (╯°□°）╯︵ ┻━┻',
        4: 'Very High ┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
      };

      const verificationLevel = verificationLevels[guild.verificationLevel] || 'Unknown';
      const members = await guild.members.fetch({ timeout: 5000 }).catch((error) => {
        throw new Error('GuildMembersTimeout');
      });
      const totalMembers = members.size;
      const totalBots = members.filter(member => member.user.bot).size;
      const totalHumans = totalMembers - totalBots;
      const iconURL = guild.iconURL({ dynamic: true }) || `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;

      const serverInfoEmbed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle(`${guild.name} Server Info`)
        .setThumbnail(iconURL)
        .addFields(
          { name: 'Server Name', value: guild.name, inline: true },
          { name: 'Server ID', value: guild.id, inline: true },
          { name: 'Owner', value: `${owner.user.tag} (${owner.user.id})`, inline: true },
          { name: 'Total Members', value: totalMembers.toString(), inline: true },
          { name: 'Humans', value: totalHumans.toString(), inline: true },
          { name: 'Bots', value: totalBots.toString(), inline: true },
          { name: 'Server Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
          { name: 'Verification Level', value: verificationLevel, inline: true },          { name: 'Total Categories', value: guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size.toString(), inline: true },
          { name: 'Total Voice Channels', value: guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size.toString(), inline: true },
          { name: 'Total Text Channels', value: guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size.toString(), inline: true },
          { name: 'Total Roles', value: guild.roles.cache.size.toString(), inline: true },
          { name: 'Boost Count', value: String(guild.premiumSubscriptionCount ?? '0'), inline: true },
          { name: 'Server Boost Level', value: `Tier ${guild.premiumTier}`, inline: true }
        )
        .setFooter({ text: 'Server info provided by Slasher' });

      await interaction.editReply({ embeds: [serverInfoEmbed], ephemeral: false });
    } catch (error) {
      console.error("An error occurred while creating the server info embed:", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: "Oops! An error occurred while displaying server info. Please try again later.", ephemeral: true });
      } else {
        await interaction.reply({ content: "Oops! An error occurred while displaying server info. Please try again later.", ephemeral: true });
      }
    }
  }
};