import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { command } from "../../../interfaces"
import { Guild } from "../../../models";
import { redis } from "../../../utils";
import axios from 'axios';
import { resolveSync } from "bun";

const build = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Developer commands')
    .addSubcommand(s => s
        .setName("get")
        .setDescription("Get cached data"))
    .addSubcommand(s => s
        .setName("update")
        .setDescription("Update cached data"))
    .addSubcommand(s => s
        .setName("check")
        .setDescription("Check if data is in cache"))

export default command<ChatInputCommandInteraction>(build, async ({ client, interaction }) => {
    const subCommand = interaction.options.getSubcommand()
    if (!interaction.guildId) return interaction.reply("Failed.");

    switch (subCommand) {

        case ("get"): {
            const startTime = performance.now();
            const [memberData, hitCache] = await Guild.fetchOneOrCreate(interaction.guildId);
            const endTime = performance.now();
            const timeTaken = (endTime - startTime).toFixed(2);
            await interaction.reply(`**FETCHED:**\n\`\`\`json\n${JSON.stringify(memberData, null, "\t")}\n\`\`\`(Fetched from cache: ${hitCache} - Took ${timeTaken}ms)`);
            break;
        }

        case ("update"): {
            const startTime = performance.now();
            const newData = await Guild.fetchOneAndUpdate(interaction.guildId, { $set: { "values.options.messageLog": "Something ig" } });
            const endTime = performance.now();
            const timeTaken = (endTime - startTime).toFixed(2);
            await interaction.reply(`**UPDATED:**\n\`\`\`json\n${JSON.stringify(newData, null, "\t")}\n\`\`\`(Updated - Took ${timeTaken}ms)`);
            break;
        }

        case ("check"): {
            const inCache = await redis.get(`guild:${interaction.guildId}`)
            await interaction.reply(`**CACHED:** ${inCache ? "TRUE" : "FALSE"}`);
            break;
        }

    }
}, true)