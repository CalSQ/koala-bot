import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { command } from "../../../interfaces"

const build = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Developer commands')

export default command<ChatInputCommandInteraction>(build, async ({ client, interaction }) => {
    if (interaction.user.id !== client.config.info.developerId) return;

    const logChannel = client.channels.cache.get("1138924763155279884");
    if (!logChannel?.isTextBased()) return interaction.reply("Could not complete task sir. (1)");

    const lastMessage = await logChannel.messages.fetch({ limit: 1 });
    if (!lastMessage) return interaction.reply("Could not complete task sir. (2)");

    const embed = lastMessage.first()?.embeds[0];
    if (!embed) return interaction.reply("Could not complete task sir. (3)");
    const copiedEmbed = EmbedBuilder.from(embed);
    
    await logChannel.send(`_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n_ _\n`);
    const infoMsg = await logChannel.send({content: `## Infraction Logs\n> This channel logs member infractions and moderator activity.\n__Please keep chatting out of this channel as it clogs up the channel - A primary thread was created for this sole purpose.__\n\n**__Log Format__**\n* White: Avatar and username of user receiving action\n* Black: Mention of user receiving action\n* Blue: Action being placed on user\n* Orange: The reason for the infraction\n* Pink: The user who issued the infraction\n* Purple: The ID of the moderation log\n* Green: Timestamp of when the infraction occured.`, files: [{ attachment: "https://media.discordapp.net/attachments/1085873944751521792/1193310138635923576/bknLaWD.png?ex=65ac3fab&is=6599caab&hm=a2e3780a28be84fd49eda01ae546c37cc1682120743f50a70847c61d674c6156&=&format=webp&quality=lossless" }]});
    await logChannel.send({ content: `_ _\n_ _` });
    await logChannel.send({ embeds: [copiedEmbed] });
    infoMsg.pin();

    interaction.reply("Done!");
})