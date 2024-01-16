import { EmbedBuilder, Events } from "discord.js"
import { event } from "../../interfaces"
import { Guild } from "../../models"

export default event(Events.MessageUpdate, false, async ({ client }, oldMessage, newMessage) => {
    if (!newMessage.guildId || !newMessage.author) return;
    if (newMessage.author.bot) return;
    const [guildData] = await Guild.fetchOneOrCreate(newMessage.guildId);
    if (!guildData) return;
    const channelId = guildData.values.options.messageLog;
    if (channelId && channelId !== newMessage.channelId) {
        const channel = client.channels.cache.get(channelId);
        if (!channel?.isTextBased()) return;
        const Embed = new EmbedBuilder()
            .setAuthor({ name: "by @" + newMessage.author.username, iconURL: newMessage.author.displayAvatarURL() })
            .setDescription(`[Message](${newMessage.url}) from ${newMessage.author} was edited in ${newMessage.channel}\n\n**Content Before**\n${oldMessage.content}\n\n**Content After**\n${newMessage.content}`)
            .setFooter({ text: `User ID: ${newMessage.author.id}` })
            .setColor(client.config.colors.messageLog.edit)
            .setTimestamp(newMessage.createdTimestamp)
        channel.send({ embeds: [Embed] })
    }
})
