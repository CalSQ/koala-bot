import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command } from "../../../interfaces"

const build = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Developer commands')

export default command<ChatInputCommandInteraction>(build, async ({ interaction }) => {
    interaction.reply("Working")
})