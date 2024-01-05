/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"

import test from "./slash/developer/test";

export const slashCategory = [
    category("testing" , [
        test
    ])
] as CommandCategory[]

export const contextCategory = [
    category("developer" , [

    ])
] as CommandCategory[]