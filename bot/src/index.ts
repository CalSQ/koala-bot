import { DiscordjsError, GatewayIntentBits, Partials } from "discord.js";
import ApplicationClient from "./classes/ApplicationClient"
import { ConnectOptions, connect } from "mongoose";

const client = new ApplicationClient({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration, GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.User, Partials.Message,
        Partials.GuildMember, Partials.ThreadMember,
        Partials.Reaction
    ]
})

client.login(Bun.env.BOT_TOKEN).then(async () => {
    if (!Bun.env.DB_URL) return console.warn(`[ Mongo ]: No database URL provided.`)
    await connect(Bun.env.DB_URL, {
        autoIndex: true
    } as ConnectOptions).then(() => {
        client.databaseConnected = true
        console.log(`[ Mongo: CONNECTED ] - Connected to the database.`);
    }).catch(err => {
        throw new Error(`[ Mongo: ERROR ] - ${err}`);
    })
}).catch((err: unknown) => {
    if (err instanceof DiscordjsError) {
        return console.error(`[ Bot: ${err.code} ] ${err.name} - ${err.message}`);
    }
    throw err
})