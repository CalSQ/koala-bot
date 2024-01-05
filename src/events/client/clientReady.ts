import { ButtonStyle, Events, MessageActionRowComponentBuilder } from "discord.js";
import { ButtonBuilder, ActionRowBuilder } from "discord.js";
import { event } from "../../interfaces";

export default event(Events.ClientReady, true, async ({ client }) => {
    console.log(`${client.user?.username} has logged in!`);
    await client.deploy();

    // const channel = await client.channels.fetch("1137556888255483978");
    // if (channel?.isTextBased()) {
    //     const newButton = new ButtonBuilder()
    //         .setCustomId("post-idea")
    //         .setLabel("Post")
    //         .setStyle(ButtonStyle.Primary);

    //     const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
    //         .setComponents(newButton);

    //     channel.send({components: [row]});
    // }
})
