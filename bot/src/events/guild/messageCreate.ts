import { BaseGuildTextChannel, EmbedBuilder, Events } from "discord.js"
import { event } from "../../interfaces"

export default event(
  Events.MessageCreate,
  false,
  async ({ client }, message) => {
    if (
      message.mentions.has(client.config.info.developerId) &&
      message.channel instanceof BaseGuildTextChannel &&
      message.guildId === client.config.info.developerGuild &&
      !message.author.bot
    ) {
      const webhooks = await message.channel.fetchWebhooks()
      const owner = await client.users.fetch(client.config.info.developerId)
      let webhook = webhooks.find((hook) => {
        hook.name === "Mention"
      })
      if (!webhook) {
        webhook = await message.channel.createWebhook({
          name: owner.username,
          avatar: owner.displayAvatarURL(),
          reason: "To reply to ping for me lol",
        })
      }

      await webhook.send({ content: `${message.author} hi` })
      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.username,
          iconURL: message.author.displayAvatarURL(),
        })
        .setDescription(`${message.content}\n${message.url}`)
      await owner.send({ embeds: [embed] })
    }

    if (message.author.id === client.config.info.developerId) {
      const msgArguments = message.content.toLowerCase().split(" ")

      //////////////////////////////////////////////////////////////////////////

      switch (msgArguments[0]) {
        case ".test": {
          message.reply({ content: "Working!" })
          break
        }
      }

      //////////////////////////////////////////////////////////////////////////
    }
  }
)
