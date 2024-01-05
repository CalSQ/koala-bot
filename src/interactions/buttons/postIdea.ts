import { ModalBuilder, TextInputStyle, ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder, ButtonInteraction } from "discord.js";
import { interaction } from "../../interfaces";

export default interaction<ButtonInteraction>("post-idea", async ({ interaction }) => {
    const modal = new ModalBuilder()
        .setCustomId("post-idea-menu")
        .setTitle("Post Idea");
     
    const ideaField = new TextInputBuilder()
        .setCustomId("idea-entry")
        .setLabel("Submit an idea for the bot")
        .setStyle(TextInputStyle.Paragraph);

    const row = new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(ideaField);

    modal.setComponents(row);

    await interaction.showModal(modal);
})