import { Embed, EmbedBuilder, Events } from "discord.js";
import { event } from "../../interfaces";
import { createCanvas } from "canvas";

export default event(Events.ClientReady, true, async ({ client }) => {
    console.log(`${client.user?.username} has logged in!`);
    await client.deploy();

    const channel = await client.channels.cache.get("1085873944751521792");
    if (channel?.isTextBased()) {

        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');
        ctx.font = '30px Impact'
        ctx.fillText('Awesome!', 50, 100)
        const text = ctx.measureText('Awesome!')
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.beginPath()
        ctx.lineTo(50, 102)
        ctx.lineTo(50 + text.width, 102)
        ctx.stroke()

        const imgURL = canvas.toDataURL()

        const embed = new EmbedBuilder()
            .setTitle("Canvas")
            .setImage(imgURL)

        await channel.send({ embeds: [embed] });

    }
})
