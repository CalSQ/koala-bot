import { AuditLogEvent, EmbedBuilder, Events, time } from "discord.js"
import { Guild, Member } from "../../models"
import { event } from "../../interfaces"

export default event(Events.GuildAuditLogEntryCreate, false, async ({ client, log }, { executorId, targetId, reason, action }, guild) => {
    
    if (!executorId || !targetId) return;

    switch (action) {

        case (AuditLogEvent.MemberUpdate): {
            
            break;
        }

        case (AuditLogEvent.MemberKick): {
            // Get log channel
            const guildData = await Guild.getById(guild.id);
            const channelId = guildData.values.options.memberLog;
            if (!channelId) return;
            const channel = client.channels.cache.get(channelId);
            if (!channel?.isTextBased()) return;
            const kickedAt = new Date();

            const executor = await client.users.fetch(executorId);
            const target = await client.users.fetch(targetId);
            const logCount = ++guildData.values.modLogCount;


            // Send formatted infraction log in channel
            const infractionLog = new EmbedBuilder()
                .setAuthor({name: target.username, iconURL: target.displayAvatarURL()})
                .setDescription(`**User**: ${target}\n**Action:** Kick\n**Reason:** ${reason ?? "Not provided"}\n\nModerated by ${executor ?? "unknown"}`)
                .setFooter({text: `Modlog #${logCount}`})
                .setTimestamp(kickedAt);
            channel.send({embeds: [infractionLog]});

            await guildData.save();
            break;
        }

    }

})