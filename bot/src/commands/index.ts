/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"

import config from "./slash/util/config"
import dm from "./slash/util/dm"
import mc from "./slash/util/mc"

export const slashCategory = [
  category("util", [config, mc, dm]),
] as CommandCategory[]

export const contextCategory = [category("developer", [])] as CommandCategory[]
