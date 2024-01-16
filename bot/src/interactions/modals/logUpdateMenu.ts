import { EmbedBuilder, ModalSubmitInteraction } from "discord.js";
import { interaction } from "../../interfaces";
import { Infraction } from "../../models";
import { Types } from "mongoose";

export default interaction<ModalSubmitInteraction>("log-update-menu", async ({ client, interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    const newReason = interaction.fields.getTextInputValue("reason");
    if (!interaction.message) return interaction.editReply("There was a problem.");
    const embedData = interaction.message.embeds[0];
    if (!embedData.description || !embedData.footer) return interaction.editReply("There was a problem.");

    const logId = embedData.footer.text.match(/(?<=ID: ).*/)?.[0];
    if (!logId) return interaction.editReply("There was a problem.");
    const newDescription = embedData.description.replace(/(?<=\*\*Reason:\*\* ).*(?=\n)/, newReason);

    await Infraction.fetchOneAndUpdate(new Types.ObjectId(logId), { $set: { "data.reason": newReason } });

    const newEmbed = EmbedBuilder.from(embedData);
    newEmbed.setDescription(newDescription);
    await interaction.message.edit({ embeds: [newEmbed], content: `Updated by ${interaction.user}`, allowedMentions: { users: [] } });
    return interaction.editReply({ content: `Reason updated for Log ID: ${logId}` });
})