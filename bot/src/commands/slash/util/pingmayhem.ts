import {
  BaseGuildTextChannel,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"
import { command } from "../../../interfaces"
import mongoose from "mongoose"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const build = new SlashCommandBuilder()
  .setName("pingmayhem")
  .setDescription("Ping Mayhem")
  .addIntegerOption((s) =>
    s
      .setName("amount")
      .setDescription("Amount of ghost pings to send")
      .setRequired(true)
  )
  .addUserOption((u) =>
    u.setName("user").setDescription("User to ping").setRequired(true)
  )
  .setDMPermission(false)

let sendingPings = false

export default command<ChatInputCommandInteraction>(
  build,
  {},
  async ({ client, interaction, log }) => {
    const amountPings = interaction.options.getInteger("amount", true)
    const userToPing = interaction.options.getUser("user", true)

    if (!interaction.guild) return
    if (
      interaction.user.id !== client.config.info.developerId &&
      interaction.user.id !== "1045011641940574208"
    )
      return interaction.reply(
        "🟥 Such a powerful command can not be used by mere mortals!"
      )
    if (sendingPings)
      return interaction.reply("🟥 A ghost ping mayhem is already in progress")
    if (amountPings > 20)
      return interaction.reply("🟥 There is a limit of 20 at once")

    sendingPings = true

    try {
      const initialMsg = await interaction.reply({
        content: "Sending Ghost Pings...",
        ephemeral: true,
      })

      const channelIds = interaction.guild.channels.cache
        .filter((channel) => channel.isTextBased())
        .map((channel) => channel.id)

      for (let i = 0; i < amountPings; i++) {
        const channelId =
          channelIds[Math.floor(Math.random() * channelIds.length)]
        const channel = interaction.guild.channels.cache.get(channelId)
        if (
          channel &&
          channel
            .permissionsFor(interaction.guild.members.me!)
            .has(PermissionFlagsBits.ManageWebhooks) &&
          channel instanceof BaseGuildTextChannel
        ) {
          console.log(`Sending webhook message... (${i + 1}/${amountPings})`)
          const webhook = await channel.createWebhook({
            name: "Mayhem!",
          })
          const msg = await webhook.send({
            content: `<@${userToPing.id}>`,
            username: new mongoose.Types.ObjectId().toString(),
          })
          await msg.delete()
          await webhook.delete()
          await sleep(500)
        }
      }
      await initialMsg.edit({ content: "✅ Ghost Pings sent!" })
      console.log("Ghost pings sent!")
      sendingPings = false
    } catch (err) {
      await interaction.reply(
        "🟥 An error occurred while sending ghost pings,\n${err.message}"
      )
      sendingPings = false
    }
  }
)
