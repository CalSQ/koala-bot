/*

    Button, menu and modal interaction files for discord bot

*/

import { InteractionCategory, interactionCategory } from "../interfaces"
import postIdea from "./buttons/postIdea"
import postIdeaMenu from "./modals/postIdeaMenu"

export const buttonCategory = [
    interactionCategory("testing", [
        postIdea
    ])
] as InteractionCategory[]

export const menuCategory = [

] as InteractionCategory[]

export const modalCategory = [
    interactionCategory("testing", [
        postIdeaMenu
    ])
] as InteractionCategory[]