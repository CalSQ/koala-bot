import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command } from "../../../interfaces"

const build = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Developer commands')

export default command<ChatInputCommandInteraction>(build, async ({ client, interaction }) => {

    const logChannel = client.channels.cache.get("1138924763155279884");
    if (!logChannel?.isTextBased()) return interaction.reply("Could not complete task sir. (1)");

    const lastMessage = await logChannel.messages.fetch({ limit: 1 });
    if (!lastMessage) return interaction.reply("Could not complete task sir. (2)");

    const embed = lastMessage.first()?.embeds[0];
    if (!embed) return interaction.reply("Could not complete task sir. (3)");
    const copiedEmbed = EmbedBuilder.from(embed);

    await logChannel.send(`_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n`);
    await logChannel.send({ embeds: [copiedEmbed] });

    interaction.reply("Done!");
})