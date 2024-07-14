import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import { command } from "../../../interfaces"

const build = new SlashCommandBuilder()
  .setName("dm")
  .setDescription("DM user")
  .addUserOption((s) =>
    s.setName("user").setDescription("User").setRequired(true)
  )
  .addStringOption((s) =>
    s.setName("message").setDescription("Message").setRequired(true)
  )
  .setDMPermission(false)

export default command<ChatInputCommandInteraction>(
  build,
  {},
  async ({ client, interaction, log }) => {
    const user = interaction.options.getUser("user", true)
    const message = interaction.options.getString("message", true)

    if (interaction.user.id !== client.config.info.developerId)
      return interaction.reply("🟥 Command can not be used by mere mortals!")

    try {
      const dm = await user.createDM()
      await dm.send(message)
      await interaction.reply("🟩 DM sent successfully")
    } catch (err) {
      await interaction.reply(
        "🟥 An error occurred while sending DM,\n${err.message}"
      )
    }
  }
)
