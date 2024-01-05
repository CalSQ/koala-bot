/*

    Event files for discord and other packages

*/

import { Event } from "../interfaces"

import clientReady from "./client/clientReady"
import messageCreate from "./guild/messageCreate"
import messageDelete from "./guild/messageDelete"
import messageUpdate from "./guild/messageUpdate"
import interactionCreate from "./interaction/interactionCreate"

export default [
    clientReady,
    messageCreate,
    messageDelete,
    messageUpdate,
    interactionCreate
] as Event[]
