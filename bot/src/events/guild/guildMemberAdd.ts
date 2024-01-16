import { EmbedBuilder, Events } from "discord.js";
import { Guild } from "../../models";
import { event } from "../../interfaces";

export default event(Events.GuildMemberAdd, false, async ({ client, log }, member) => {
    // Get log channel
    const [guildData] = await Guild.fetchOneOrCreate(member.guild.id);
    if (!guildData) return;
    const channelId = guildData.values.options.memberLog;
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;

    // Send formatted member log in channel
    const Embed = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setDescription(`Welcome to the server, ${member}.\nThere are now **${member.guild.memberCount}** members in the server!`)
        .setFooter({text: member.guild.id})
        .setColor(client.config.colors.memberLog.join)
        .setTimestamp(member.joinedTimestamp);

    channel.send({ embeds: [Embed] });
})