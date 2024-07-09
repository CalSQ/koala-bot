/*

    SContext and Slash Command files for discord bot

*/

import { CommandCategory, category } from "../interfaces"

import config from "./slash/util/config"
import test from "./slash/developer/test"
import mc from "./slash/util/mc"

export const slashCategory = [
  category("developer", [test]),
  category("util", [config, mc]),
] as CommandCategory[]

export const contextCategory = [category("developer", [])] as CommandCategory[]
