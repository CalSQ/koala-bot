import { AuditLogEvent, EmbedBuilder, Events } from "discord.js";
import { Guild, Member } from "../../models";
import { Infraction, event } from "../../interfaces";

export default event(Events.GuildBanAdd, false, async ({ client, log }, { user, reason = "Not provided", guild }) => {
    // Get log channel and increment mod log count
    const guildData = await Guild.getById(guild.id);
    const channelId = guildData.values.options.modLog;
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;
    const logCount = ++guildData.values.modLogCount;
    await guildData.save();

    // Get audit log
    const logs = await guild.fetchAuditLogs({
        type: AuditLogEvent.MessageDelete,
        limit: 1,
    });
    const firstEntry = logs.entries.first();
    const executor = firstEntry?.executorId && await client.users.fetch(firstEntry.executorId);
    const bannedAt = Date.now() * 1000;
    
    // Send formatted log in logs channel
    const infractionLog = new EmbedBuilder()
        .setAuthor({name: `${user.username} (${user.id})`, iconURL: user.displayAvatarURL()})
        .setDescription(`**Action:** Ban\n**Reason:** ${reason}\n\nModerated by ${executor ?? "unknown"}`)
        .setFooter({text: `Modlog #${logCount}`})
        .setTimestamp(bannedAt);
    channel.send({embeds: [infractionLog]});

    // Create infraction and save to member
    const memberData = await Member.getByIds(guild.id, user.id);
    const newEntry: Infraction = {
        action: "Ban",
        modId: firstEntry?.executorId ?? undefined,
        reason: reason ?? undefined,
        at: bannedAt
    }
    memberData.values.infractions.push(newEntry);
    await memberData.save();
})