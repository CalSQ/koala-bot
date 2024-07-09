import { EmbedBuilder, Events } from "discord.js"
import { event } from "../../interfaces"
import { Guild } from "../../models"

export default event(Events.MessageDelete, false, async ({ client }, message) => {
    if (!message.guildId || !message.author) return;
    if (message.author.bot) return;
    const [guildData] = await Guild.fetchOneOrCreate(message.guildId);
    if (!guildData) return;
    const channelId = guildData.values.options.messageLog;
    if (channelId && channelId !== message.channelId) {
        const channel = client.channels.cache.get(channelId);
        if (!channel?.isTextBased()) return;

        const infractionEmbed = new EmbedBuilder()
            .setAuthor({ name: "by @" + message.author.username, iconURL: message.author.displayAvatarURL() })
            .setDescription(`Message from ${message.author} was deleted in ${message.channel}${message.content?.length !== 0 ? `\n\n**Content**\n${message.content}` : ""}`)
            .setFooter({ text: `User ID: ${message.author.id}` })
            .setColor(client.config.colors.messageLog.delete)
            .setTimestamp(message.createdTimestamp);

        const loggedMessage = await channel.send({ embeds: [infractionEmbed] });

        if (message.attachments.size === 0) return;
        const attachments = message.attachments.map(attachment => attachment)
        loggedMessage.reply({ content: `**Attachments:**`, files: attachments })
    }
})
