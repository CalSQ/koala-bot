import { model, Schema, Model, HydratedDocument, UpdateQuery } from 'mongoose';
import { config, redis } from '../utils';

interface IGuild {
  guildId: string,
  values: {
    options: {
      messageLog?: string,
      memberLog?: string,
      modLog?: string
    }
  },
  metadata: {
    createdAt?: Date,
    lastModified?: Date
  }
}

interface GuildModel extends Model<IGuild> {
  fetchOneOrCreate(guildId: string): Promise<[HydratedDocument<IGuild> | IGuild, boolean]>,
  fetchOneAndUpdate(guildId: string, query: UpdateQuery<IGuild>): Promise<HydratedDocument<IGuild>>,
}

const GuildSchema = new Schema<IGuild, GuildModel>({
  guildId: { type: String, required: true, unique: true }, // Guild ID
  values: {
      options: {
          messageLog: String, // Log for deleted & updated messages
          modLog: String, // Log for moderation and reports
          memberLog: String // Log for member joins
      }
  },
  metadata: {
      createdAt: { type: Date, default: () => new Date() }, // When entry was created
      lastModified: Date // When entry was last modified
  }
}, { autoIndex: true })

/**
 * @name fetchOneOrCreate
 * @description Fetches guilds data otherwise creates it if it doesn't exist
 * @param guildId ID of the guild associated with the data
 * @returns Tuple [data: Document | IGuild, hitCache: boolean]
 */
GuildSchema.static("fetchOneOrCreate", async function(guildId: string) {
  // Find in cache
  if (redis.isReady) {
    const data = await redis.get(`guild:${guildId}`);
    if (data) return [JSON.parse(data) as IGuild, true];
  } else console.warn("[ REDIS ] - Problem connecting to redis for Guild.fetchOneOrCreate");

  // Find data otherwise create
  const data = await Guild.findOne({ guildId }) ?? await Guild.create({ guildId });
  if (redis.isReady) {
    await redis.set(`guild:${guildId}`, JSON.stringify(data), { EX: config.constraints.cache_expiry });
  }
  return [data, false];
})

/**
 * @name fetchOneAndUpdate
 * @description Fetches guilds data and updates it with the query
 * @param guildId ID of the guild associated with the data
 * @param query The query for updating the data
 * @returns Updated document
 */
GuildSchema.static("fetchOneAndUpdate", async function(guildId: string, query: UpdateQuery<IGuild>) {
  // Update data
  query.$set = query.$set ?? {};
  query.$set["metadata.lastModified"] = new Date();
  const data = await Guild.findOneAndUpdate({ guildId }, query, { new: true, runValidators: true, upsert: true });

  // Add to cache
  if (redis.isReady) {
    await redis.set(`guild:${guildId}`, JSON.stringify(data), { EX: config.constraints.cache_expiry });
  } else console.warn("[ REDIS ] - Problem connecting to redis for Guild.fetchOneAndUpdate");

  return data;
})


export const Guild = model<IGuild, GuildModel>('Guild', GuildSchema);