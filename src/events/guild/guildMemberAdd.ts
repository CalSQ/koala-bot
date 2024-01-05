import { EmbedBuilder, Events } from "discord.js";
import { Guild } from "../../models";
import { event } from "../../interfaces";

export default event(Events.GuildMemberAdd, false, async ({ client, log }, member) => {
    const guildData = await Guild.getById(member.guild.id);
    const channelId = guildData.values.options.memberLog;
    if (!channelId) return;
    const channel = client.channels.cache.get(channelId) ?? await client.channels.fetch(channelId);
    if (!channel?.isTextBased()) return;

    const Embed = new EmbedBuilder()
        .setAuthor({ name: member.user.username, iconURL: member.displayAvatarURL() })
        .setDescription(`Welcome to the server, ${member}.\nThere are now **${member.guild.memberCount}** members in the server!`)
        .setFooter({text: member.guild.id})
        .setColor(client.config.colors.memberLog.join ?? client.config.colors.default)
        .setTimestamp(member.joinedTimestamp);

    channel.send({ embeds: [Embed] });
})