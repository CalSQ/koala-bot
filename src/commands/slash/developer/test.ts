import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command } from "../../../interfaces"

const build = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Developer commands')

export default command<ChatInputCommandInteraction>(build, async ({ client, interaction }) => {

    const logChannel = client.channels.cache.get("1138924763155279884");
    if (!logChannel?.isTextBased()) return interaction.reply("Could not complete task sir.");

    const lastMessage = logChannel.lastMessage;
    if (!lastMessage) return interaction.reply("Could not complete task sir.");

    const embed = lastMessage.embeds[0];
    const copiedEmbed = EmbedBuilder.from(embed);

    await logChannel.send(`* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n*\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n* *\n`);
    await logChannel.send({ embeds: [copiedEmbed] });

    interaction.reply("Done!");
})