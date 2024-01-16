import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { command } from "../../../interfaces";
import { Guild, Member } from "../../../models"

const build = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Server configuration options')
    .addSubcommand(s => s.setName("database").setDescription("Show database information")
        .addUserOption(o => o.setName("user").setDescription("Member to view database of (Leave blank for guild)")))
    .addSubcommand(s => s.setName("log").setDescription("Change log channels")
        .addStringOption(o => o.setName("type").setDescription("Type of log to set").setRequired(true)
            .addChoices({name: "Moderation Log", value:"modLog"}, {name: "Message Log", value: "messageLog"}, {name: "Member Log", value: "memberLog"}))
        .addChannelOption(o => o.setName('channel').setDescription('The channel to log information to')))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

export default command<ChatInputCommandInteraction>(build, async ({ client, interaction, log }) => {
    const subCommand = interaction.options.getSubcommand()
    if (!interaction.guild) return;
    switch (subCommand) {
        case ("database"): {
            const user = interaction.options.getUser("user")
            if (user) {
                if (user.bot) return interaction.reply({content: "You can't retrieve data for a bot.", ephemeral: true})
                let memberData = await Member.fetchOneOrCreate(interaction.guild.id, user.id)
                const jsonData = memberData ? `\`\`\`json\n${JSON.stringify(memberData, null, "\t")}\`\`\`` : 'No data could be retrieved'
                await interaction.reply({content: `**Showing database information for member ${user} (${user.id}):**\n${jsonData}`, ephemeral: true})
            } else {
                let guildData = await Guild.fetchOneOrCreate(interaction.guild.id)
                const jsonData = guildData ? `\`\`\`json\n${JSON.stringify(guildData, null, "\t")}\`\`\`` : 'No data could be retrieved'
                await interaction.reply({content: `**Showing database information for guild __${interaction.guild.name}__ (${interaction.guild.id}):**\n${jsonData}`, ephemeral: true})
            }
            break;
        }
        case ("log"): {
            const channel = interaction.options.getChannel("channel")
            const type = interaction.options.getString("type", true) as ("memberLog" | "messageLog" | "modLog")
            await Guild.fetchOneAndUpdate(interaction.guild.id, { $set: { [`values.options.${type}`]: channel?.id } });
            await interaction.reply({content: `**${type}** ${channel ? `set to channel ${channel} (${channel.id})` : "removed"}`, ephemeral: true})
        }
    }
})