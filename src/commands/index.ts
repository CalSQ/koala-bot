/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces";

import config from "./slash/developer/config";
import test from "./slash/developer/test";

export const slashCategory = [
    category("testing" , [
        test,
        config
    ])
] as CommandCategory[]

export const contextCategory = [
    category("developer" , [

    ])
] as CommandCategory[]