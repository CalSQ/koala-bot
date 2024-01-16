import { Config } from "../interfaces";

export const config = {

    info: {
        developerId: "589546428137865217",
        developerGuild: "690342051778396403",
        restVersion: "10"
    },

    constraints: {
        cache_expiry: 60,
        paginationFieldLimit: 6,
        defaultPaginationTime: 60_000,
        collectionTime: 60_000,
    },

    colors: {
        default: "#ffffff",
        error: "#c12a22",
        info: "#70c9b4",
        messageLog: {
            edit: "#22c1b9", // Blue
            delete: "#c12a22" // Red
        },
        modLog: {
            timeout: "#3ac122", // Green
            untimeout: "#c12a22", // Red
            kick: "#3ac122", // Green
            ban: "#3ac122", // Green
            unban: "#c12a22" // Red
        },
        memberLog: {
            join: "#3ac122", // Green
            leave: "#c12a22", // Red
            nickname: "#22c1b9" // Blue
        }
    }

} satisfies Config;