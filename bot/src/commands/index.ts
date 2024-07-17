/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"

import config from "./slash/util/config"
import mc from "./slash/util/mc"

export const slashCategory = [
  category("util", [config, mc]),
] as CommandCategory[]

export const contextCategory = [category("developer", [])] as CommandCategory[]
