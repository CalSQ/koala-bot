/*

    Event files for discord and other packages

*/

import { Event } from "../interfaces"

import clientReady from "./client/clientReady"
import guildAuditLogEntryCreate from "./guild/guildAuditLogEntryCreate"
import guildMemberAdd from "./guild/guildMemberAdd"
import guildMemberRemove from "./guild/guildMemberRemove"
import messageCreate from "./guild/messageCreate"
import messageDelete from "./guild/messageDelete"
import messageUpdate from "./guild/messageUpdate"
import interactionCreate from "./interaction/interactionCreate"

export default [
    clientReady,
    messageCreate,
    messageDelete,
    messageUpdate,
    guildMemberAdd,
    guildMemberRemove,
    interactionCreate,
    guildAuditLogEntryCreate
] as Event[]
