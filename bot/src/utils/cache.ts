import { createClient } from "redis";

export function deleteRequireCache(includes: string) {
    for (const key in require.cache) { 
        if (key.includes(includes)) {
            delete require.cache[key];
        }
    }
}

export const redis = await createClient({
    url: Bun.env.CACHE_URL
})
.on('ready', () => console.log("[ Redis: CONNECTED ] - Connected to cache"))
.on('reconnecting', () => console.warn("[ Redis: WARN ] - Reconnecting to cache"))
.on('error', err => console.error('[ Redis: ERROR ]', err))
.connect();