import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js"
import { command } from "../../../interfaces"

const serverAddress = "51.161.87.73:25572"

const build = new SlashCommandBuilder()
  .setName("mc")
  .setDescription("Minecraft commands")
  .addSubcommand((s) =>
    s.setName("playerlist").setDescription("Show players in server")
  )
  .addSubcommand((s) =>
    s.setName("info").setDescription("Show general server information")
  )

function createErrorEmbed(type: string, message: string) {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle(`${type} Error`)
    .setDescription(message)
}

export default command<ChatInputCommandInteraction>(
  build,
  {},
  async ({ client, interaction, log }) => {
    const subCommand = interaction.options.getSubcommand()
    if (!interaction.guild) return
    await interaction.deferReply()
    switch (subCommand) {
      case "playerlist": {
        const response = await fetch(
          `https://api.mcsrvstat.us/3/${serverAddress}`
        )
        if (!response.ok)
          return interaction.editReply({
            embeds: [
              createErrorEmbed(
                "API",
                "An error occurred while fetching the server's data"
              ),
            ],
          })
        const data: any = await response.json()
        if (!data.online)
          return interaction.editReply({
            embeds: [
              createErrorEmbed(
                "Server",
                `The server is currently offline, please report any problems to <@${client.config.info.developerId}>`
              ),
            ],
          })

        const newEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Players Online")
          .setDescription(
            `Online: \`\`${data.players.online} / ${data.players.max}\`\``
          )
          .setFooter({ text: data.hostname ?? data.ip })

        if (data.players.list) {
          newEmbed.setDescription(
            newEmbed.data.description +
              `\n\n\`\`\`\n${data.players.list
                .map((plr: any) => plr.name)
                .join("\n")}\n\`\`\``
          )
        }

        await interaction.editReply({ embeds: [newEmbed] })
        break
      }

      case "info": {
        const response = await fetch(
          `https://api.mcsrvstat.us/3/${serverAddress}`
        )
        if (!response.ok)
          return interaction.editReply({
            embeds: [
              createErrorEmbed(
                "API",
                "An error occurred while fetching the server's data"
              ),
            ],
          })
        const data: any = await response.json()
        if (!data.online)
          return interaction.editReply({
            embeds: [
              createErrorEmbed(
                "Server",
                `**Status:** :negative_squared_cross_mark:\nPlease report any problems to <@${client.config.info.developerId}>`
              ),
            ],
          })

        const newEmbed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Server Information")
          .setDescription(
            `**Status:** :white_check_mark:\n**Version:** ${data.version}\n**Hostname:** ${data.hostname}\n**IP:** ${data.ip}\n**Port:** ${data.port}\n**MOTD:** ${data.motd.clean}\n**Players:** \`\`${data.players.online} / ${data.players.max}\`\``
          )
          .setFooter({
            text: `Ping CS for technical problems`,
          })
          .setThumbnail(
            "https://cdn.discordapp.com/icons/601117178896580608/a_27ff43b4bcef2b4323f18bf23fb2ad1b.gif?size=480"
          )

        interaction.editReply({ embeds: [newEmbed] })
        break
      }
    }
  }
)
