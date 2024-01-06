import { AuditLogEvent, EmbedBuilder, Events, time } from "discord.js"
import { Guild, Member } from "../../models"
import { Infraction, event } from "../../interfaces"

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

            // Create infraction and save to member
            const memberData = await Member.getByIds(guild.id, targetId);
            const newEntry: Infraction = {
                action: "Kick",
                modId: executorId,
                reason: reason ?? undefined,
                at: kickedAt
            }
            memberData.values.infractions.push(newEntry);

            await guildData.save();
            break;
        }

        case (AuditLogEvent.MemberBanAdd): {
            // Get log channel and increment mod log count
            const guildData = await Guild.getById(guild.id);
            const channelId = guildData.values.options.modLog;
            if (!channelId) return;
            const channel = client.channels.cache.get(channelId);
            if (!channel?.isTextBased()) return;
            
            const bannedAt = new Date();
            const executor = await client.users.fetch(executorId);
            const target = await client.users.fetch(targetId);
            const logCount = ++guildData.values.modLogCount;

            // Send formatted log in logs channel
            const infractionLog = new EmbedBuilder()
                .setAuthor({name: `${target.username}`, iconURL: target.displayAvatarURL()})
                .setDescription(`**User**: ${target}\n**Action:** Ban\n**Reason:** ${reason ?? "Not provided"}\n\nModerated by ${executor ?? "unknown"}`)
                .setFooter({text: `Modlog #${logCount}`})
                .setTimestamp(bannedAt);
            channel.send({embeds: [infractionLog]});

            // Create infraction and save to member
            const memberData = await Member.getByIds(guild.id, targetId);
            const newEntry: Infraction = {
                action: "Ban",
                modId: executorId,
                reason: reason ?? undefined,
                at: bannedAt
            }
            memberData.values.infractions.push(newEntry);

            await guildData.save();
            break;
        }

        case (AuditLogEvent.MemberBanRemove): {
            // Get log channel
            const guildData = await Guild.getById(guild.id);
            const channelId = guildData.values.options.modLog;
            if (!channelId) return;
            const channel = client.channels.cache.get(channelId);
            if (!channel?.isTextBased()) return;
            
            const unbannedAt = new Date();
            const executor = await client.users.fetch(executorId);
            const target = await client.users.fetch(targetId);

            // Send formatted log in logs channel
            const infractionLog = new EmbedBuilder()
                .setAuthor({name: `${target.username}`, iconURL: target.displayAvatarURL()})
                .setDescription(`**User**: ${target}\n**Action:** Unban\n\nModerated by ${executor ?? "unknown"}`)
                .setTimestamp(unbannedAt);
            channel.send({embeds: [infractionLog]});

            break;
        }

    }

})