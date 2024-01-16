import { EmbedBuilder, Events } from "discord.js";
import { Guild } from "../../models";
import { event } from "../../interfaces";

export default event(Events.GuildMemberRemove, false, async ({ client, log }, member) => {
    // Get log channel
    const [guildData] = await Guild.fetchOneOrCreate(member.guild.id);
    const channelId = guildData.values.options.memberLog;
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;
    const leftAt = new Date();
    
    // Send formatted member log in channel
    const Embed = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setDescription(`${member} left the server!\nThere are now **${member.guild.memberCount}** members in the server!`)
        .setFooter({text: member.guild.id})
        .setColor(client.config.colors.memberLog.leave)
        .setTimestamp(leftAt);
        
    channel.send({ embeds: [Embed] });
})