/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"

import config from "./slash/util/config"
import mc from "./slash/util/mc"
import pingmayhem from "./slash/util/pingmayhem"

export const slashCategory = [
  category("util", [config, mc, pingmayhem]),
] as CommandCategory[]

export const contextCategory = [category("developer", [])] as CommandCategory[]
