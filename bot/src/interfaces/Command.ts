import ApplicationClient from "../classes/ApplicationClient"
import { Awaitable, CommandInteraction, ContextMenuCommandBuilder, SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import { Logger } from "./Logger";

export type CommandBuild = SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'> | ContextMenuCommandBuilder

export interface CommandProps<T> {
    interaction: T,
    client: ApplicationClient,
    log: Logger
}

export type CommandCallback<T> = (
    props: CommandProps<T>
) => Awaitable<unknown>

export interface CommandArgs {
    developer?: boolean,
    cooldown?: number
}

export interface Command<T extends CommandInteraction> {
    build: CommandBuild,
    args: CommandArgs,
    callback: CommandCallback<T>
}

export interface CommandCategory {
    name: string,
    commands: Command<CommandInteraction>[]
}

export function command<T extends CommandInteraction>(build: CommandBuild, args: CommandArgs = { developer: false, cooldown: 0 }, callback: CommandCallback<T>): Command<T> {
    return {
        build,
        args,
        callback
    }
}

export function category(name: string, commands: Command<any>[]): CommandCategory {
    return {
        name,
        commands
    }
}