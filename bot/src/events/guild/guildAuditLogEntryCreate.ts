import { AuditLogEvent, EmbedBuilder, Events, time, Snowflake, TextBasedChannel, User, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageActionRowComponentBuilder } from "discord.js"
import { Guild, Infraction, IInfraction, LogAction, LogChannelType } from "../../models"
import { event } from "../../interfaces"
import ApplicationClient from "../../classes/ApplicationClient";
import { Types } from "mongoose";

async function createInfraction(action: LogAction, guildId: Snowflake, target: User, mod: User, reason: string = "Not provided", at: Date, until?: Date): Promise<IInfraction> {
    const newEntry = {
        logId: new Types.ObjectId(), 
        data: {targetId: target.id, guildId, action, modId: mod.id, reason, at, until}
    } satisfies IInfraction;
    await Infraction.create(newEntry);
    return newEntry;
}

async function getLogChannel(client: ApplicationClient, guildId: Snowflake, type: LogChannelType): Promise<TextBasedChannel  | undefined> {
    const [guildData] = await Guild.fetchOneOrCreate(guildId);
    if (!guildData) return;
    const channelId = guildData.values.options[type];
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;
    return channel;
}

function createBaseLogEmbed(target: User, at: Date, logId?: Types.ObjectId) {
    const infractionLog = new EmbedBuilder()
        .setAuthor({name: target.username, iconURL: target.displayAvatarURL()})
        .setTimestamp(at);
    if (logId) infractionLog.setFooter({text: `ID: ${logId}`});
    return infractionLog;
}

const updateButton = new ButtonBuilder()
    .setCustomId("log-update")
    .setLabel("Update")
    .setEmoji("📝")
    .setStyle(ButtonStyle.Primary);

const deleteButton = new ButtonBuilder()
    .setCustomId("log-delete")
    .setLabel("Delete")
    .setEmoji("🗑️")
    .setStyle(ButtonStyle.Danger);

const logActionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .setComponents(updateButton, deleteButton);


export default event(Events.GuildAuditLogEntryCreate, false, async ({ client }, { executorId, targetId, reason, action, changes, createdAt }, guild) => {
    if (!executorId || !targetId) return;
    reason = reason?.replace("\n", " ") ?? "Not provided"

    switch (action) {

        case (AuditLogEvent.MemberUpdate): {
            const change = changes[0];

            switch (change.key) {

                case ("nick"): {
                    const logAction: LogAction = "Nickname Change"
                    const target = await client.users.fetch(targetId);
                    const mod = await client.users.fetch(executorId);

                    const channel = await getLogChannel(client, guild.id, "memberLog");
                    if (!channel) return;

                    const logEmbed = createBaseLogEmbed(target, createdAt);
                    logEmbed.setDescription(`### ${logAction}\n**User**: ${target}\n**Reason:** ${reason}\n**From:** ${change.old ?? "_ _"}\n**To:** ${change.new ?? "_ _"}\n\nModerated by ${mod}`);
                    logEmbed.setColor(client.config.colors.memberLog.nickname);
                    await channel.send({ embeds: [logEmbed] });

                    break;
                }

                case ("communication_disabled_until"): {
                    const logAction: LogAction = change.new ? "Timeout" : "Timeout Removed";
                    const target = await client.users.fetch(targetId);
                    const mod = await client.users.fetch(executorId);
                    
                    if (logAction === "Timeout") {

                        const until = new Date(change.new as string);
                        const infractionEntry = await createInfraction(logAction, guild.id, target, mod, reason ?? undefined, createdAt, until);
                        
                        const channel = await getLogChannel(client, guild.id, "modLog");
                        if (!channel) return;

                        const logEmbed = createBaseLogEmbed(target, createdAt, infractionEntry.logId);
                        logEmbed.setDescription(`### ${logAction}\n**User**: ${target}\n**Reason:** ${reason}\n**Ends:** ${time(until, "R")}\n\nModerated by ${mod}`);
                        logEmbed.setColor(client.config.colors.modLog.timeout);
                        await channel.send({ embeds: [logEmbed], components: [logActionRow] });

                    } else {

                        const channel = await getLogChannel(client, guild.id, "modLog");
                        if (!channel) return;

                        const logEmbed = createBaseLogEmbed(target, createdAt);
                        logEmbed.setDescription(`### ${logAction}\n**User**: ${target}\n**Reason:** ${reason}\n\nModerated by ${mod}`);
                        logEmbed.setColor(client.config.colors.modLog.untimeout);
                        await channel.send({ embeds: [logEmbed] });

                    }

                    break;
                }

            }

            break;
        }

        case (AuditLogEvent.MemberKick): {
            const logAction: LogAction =  "Kick"
            const target = await client.users.fetch(targetId);
            const mod = await client.users.fetch(executorId);
            const infractionEntry = await createInfraction(logAction, guild.id, target, mod, reason ?? undefined, createdAt);

            const channel = await getLogChannel(client, guild.id, "modLog");
            if (!channel) return;

            const logEmbed = createBaseLogEmbed(target, createdAt, infractionEntry.logId);
            logEmbed.setDescription(`### ${logAction}\n**User**: ${target}\n**Reason:** ${reason}\n\nModerated by ${mod}`);
            logEmbed.setColor(client.config.colors.modLog.kick);
            await channel.send({ embeds: [logEmbed], components: [logActionRow] });

            break;
        }

        case (AuditLogEvent.MemberBanAdd): {
            const logAction: LogAction =  "Ban"
            const target = await client.users.fetch(targetId);
            const mod = await client.users.fetch(executorId);
            const infractionEntry = await createInfraction(logAction, guild.id, target, mod, reason ?? undefined, createdAt);

            const channel = await getLogChannel(client, guild.id, "modLog");
            if (!channel) return;

            const logEmbed = createBaseLogEmbed(target, createdAt, infractionEntry.logId);
            logEmbed.setDescription(`### ${logAction}\n**User**: ${target}\n**Reason:** ${reason}\n\nModerated by ${mod}`);
            logEmbed.setColor(client.config.colors.modLog.ban);
            await channel.send({ embeds: [logEmbed], components: [logActionRow] });

            break;
        }

        case (AuditLogEvent.MemberBanRemove): {
            const logAction: LogAction =  "Unban"
            const target = await client.users.fetch(targetId);
            const mod = await client.users.fetch(executorId);

            const channel = await getLogChannel(client, guild.id, "modLog");
            if (!channel) return;

            const logEmbed = createBaseLogEmbed(target, createdAt);
            logEmbed.setDescription(`### ${logAction}\n**User**: ${target}\n**Reason:** ${reason}\n\nModerated by ${mod}`);
            logEmbed.setColor(client.config.colors.modLog.unban);
            await channel.send({ embeds: [logEmbed] });

            break;
        }

    }

})