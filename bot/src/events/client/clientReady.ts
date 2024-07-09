import { Embed, EmbedBuilder, Events } from "discord.js";
import { event } from "../../interfaces";

export default event(Events.ClientReady, true, async ({ client }) => {
    console.log(`${client.user?.username} has logged in!`);
    await client.deploy();

    const channel = await client.channels.cache.get("1085873944751521792");
    if (channel?.isTextBased()) {

        

    }
})
