import { ModalSubmitInteraction } from "discord.js";
import { interaction } from "../../interfaces";

export default interaction<ModalSubmitInteraction>("post-idea-menu", async ({ client, interaction }) => {
    if (!interaction.isModalSubmit()) return;
    const developerId = client.config.info.developerId;
    const entry = interaction.fields.getTextInputValue('idea-entry');
    if (developerId) {
        const developer = await client.users.fetch(developerId);
        await developer.send({content: `### Idea Submission\n**User:** ${interaction.user}\n${entry}`});
        return interaction.reply({content: "Idea has been sent!", ephemeral: true});
    }
    return interaction.reply({content: "There was a problem submitting your idea!", ephemeral: true});
})