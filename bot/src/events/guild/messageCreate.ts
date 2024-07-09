import { BaseGuildTextChannel, EmbedBuilder, Events } from "discord.js"
import { event } from "../../interfaces"

export default event(
  Events.MessageCreate,
  false,
  async ({ client }, message) => {
    if (message.author.id === client.config.info.developerId) {
      const msgArguments = message.content.toLowerCase().split(" ")

      //////////////////////////////////////////////////////////////////////////

      switch (msgArguments[0]) {
        case ".checksys": {
          message.reply({ content: "✅" })
          break
        }
        case ".disable": {
          message.reply({ content: "Disabled relevent category" })
          break
        }
      }

      //////////////////////////////////////////////////////////////////////////
    }
  }
)
