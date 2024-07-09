/*

    Button, menu and modal interaction files for discord bot

*/

import { InteractionCategory, interactionCategory } from "../interfaces"
import logDelete from "./buttons/logDelete"
import logUpdate from "./buttons/logUpdate"
import logUpdateMenu from "./modals/logUpdateMenu"

export const buttonCategory = [
    interactionCategory("logs", [
        logUpdate,
        logDelete
    ])
] as InteractionCategory[]

export const menuCategory = [

] as InteractionCategory[]

export const modalCategory = [
    interactionCategory("logs", [
        logUpdateMenu
    ])
] as InteractionCategory[]