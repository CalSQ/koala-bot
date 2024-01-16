import { ModalBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, ButtonInteraction } from "discord.js";
import { interaction } from "../../interfaces";

export default interaction<ButtonInteraction>("log-update", async ({ interaction }) => {
    const modal = new ModalBuilder()
        .setCustomId("log-update-menu")
        .setTitle("Update Reason");
     
    const reasonField = new TextInputBuilder()
        .setCustomId("reason")
        .setLabel("Update reason of infraction")
        .setStyle(TextInputStyle.Short);

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(reasonField);

    modal.setComponents(row);

    await interaction.showModal(modal);
})