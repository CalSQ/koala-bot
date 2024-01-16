import { ButtonInteraction, GuildMember, PermissionFlagsBits } from "discord.js";
import { interaction } from "../../interfaces";
import { Infraction } from "../../models";

export default interaction<ButtonInteraction>("log-delete", async ({ interaction }) => {
    await interaction.deferReply({ ephemeral: true });
    if (interaction.member instanceof GuildMember) {
        const isMod = interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)
        if (!isMod) return interaction.editReply("You don't have moderation permissions")
        const embedData = interaction.message.embeds[0];
        if (embedData.footer) {
            const logId = embedData.footer.text.match(/(?<=ID: ).*/)?.[0];
            const result = await Infraction.deleteOne({ logId });
            if (result.deletedCount === 1) {
                await interaction.message.edit({ content: `Infraction was deleted by ${interaction.user}`, components: [], allowedMentions: { users: [] } });
                return interaction.editReply({ content: `Infraction deleted with Log ID: ${logId}` });
            }
        }
    }
    return interaction.editReply("There was a problem deleting the infraction entry!");
})