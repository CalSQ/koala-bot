import { Events } from "discord.js";
import { event } from "../../interfaces";

export default event(Events.MessageCreate, false, async ({ client }, message) => {
    if (message.author.id !== client.config.info.developerId) return;
    const msgArguments = message.content.toLowerCase().split(" ")

    //////////////////////////////////////////////////////////////////////////

    switch(msgArguments[0]) {

        case (".test"): {
            message.reply({content: "Working!"})
            break;
        }

    }

    //////////////////////////////////////////////////////////////////////////
})