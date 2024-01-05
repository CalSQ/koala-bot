import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { Guild } from "../../models";
import { event } from "../../interfaces";

export default event(Events.GuildMemberRemove, false, async ({ client, log }, member) => {
    const guildData = await Guild.getById(member.guild.id);

    // Get audit log
    const logs = await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        limit: 1,
        after: guildData.values.lastLog
    });
    const firstEntry = logs.entries.first();
    const kickedAt = new Date();
    if (firstEntry) guildData.values.lastLog = firstEntry.id;

    if (firstEntry) {
        // Get log channel
        const channelId = guildData.values.options.modLog;
        if (!channelId) return;
        const channel = client.channels.cache.get(channelId);
        if (!channel?.isTextBased()) return;

        const executor = firstEntry.executorId && await client.users.fetch(firstEntry.executorId);
        const logCount = ++guildData.values.modLogCount;

        // Send formatted infraction log in channel
        const infractionLog = new EmbedBuilder()
            .setAuthor({name: `${member.user.username}`, iconURL: member.user.displayAvatarURL()})
            .setDescription(`**User**: ${member.user}\n**Action:** Kick\n**Reason:** ${firstEntry.reason ?? "Not provided"}\n\nModerated by ${executor ?? "unknown"}`)
            .setFooter({text: `Modlog #${logCount}`})
            .setTimestamp(kickedAt);
        channel.send({embeds: [infractionLog]});
    } 

    // Get log channel
    const channelId = guildData.values.options.memberLog;
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;
    
    // Send formatted member log in channel
    const Embed = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setDescription(`${member} left the server!\nThere are now **${member.guild.memberCount}** members in the server!`)
        .setFooter({text: member.guild.id})
        .setColor(client.config.colors.memberLog.leave ?? client.config.colors.default)
        .setTimestamp(kickedAt);
    channel.send({ embeds: [Embed] });
    await guildData.save();
})