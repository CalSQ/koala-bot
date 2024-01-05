import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { Guild } from "../../models";
import { event } from "../../interfaces";

export default event(Events.GuildBanRemove, false, async ({ client, log }, { user, guild }) => {
    // Get log channel
    const guildData = await Guild.getById(guild.id);
    const channelId = guildData.values.options.modLog;
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;

    // Get audit log
    const logs = await guild.fetchAuditLogs({
        type: AuditLogEvent.MemberBanRemove,
        limit: 1,
    });
    const firstEntry = logs.entries.first();
    const executor = firstEntry?.executorId && await client.users.fetch(firstEntry.executorId);
    const unbannedAt = new Date();

    // Send formatted log in logs channel
    const infractionLog = new EmbedBuilder()
        .setAuthor({name: `${user.username}`, iconURL: user.displayAvatarURL()})
        .setDescription(`**User**: ${user}\n**Action:** Unban\n\nModerated by ${executor ?? "unknown"}`)
        .setTimestamp(unbannedAt);
    channel.send({embeds: [infractionLog]});
})