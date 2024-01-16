import { ColorResolvable, Snowflake } from "discord.js"

export interface Config {

    info: {
        developerId?: Snowflake,
        developerGuild?: Snowflake,
        restVersion: string
    },
    
    constraints: {
        cache_expiry: number,
        paginationFieldLimit: number,
        defaultPaginationTime: number,
        collectionTime: number
    },

    colors: {
        default: ColorResolvable,
        error: ColorResolvable,
        info: ColorResolvable,
        messageLog: {
            edit: ColorResolvable,
            delete: ColorResolvable
        },
        modLog: {
            timeout: ColorResolvable,
            untimeout: ColorResolvable,
            kick: ColorResolvable,
            ban: ColorResolvable,
            unban: ColorResolvable
        },
        memberLog: {
            join: ColorResolvable,
            leave: ColorResolvable,
            nickname: ColorResolvable
        }
    }

}
