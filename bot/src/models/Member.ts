import { model, Schema, Model, HydratedDocument, UpdateQuery } from 'mongoose';
import { redis, config } from '../utils';

interface IMember  {
  userId: string,
  guildId: string,
  values: {
    xpMultiplier: number,
    xpAmount: number,
    levelAmount: number
  },
  metadata: {
    createdAt?: Date,
    lastModified?: Date
  }
}

interface MemberModel extends Model<IMember> {
  fetchOneOrCreate(guildId: string, userId: string): Promise<[HydratedDocument<IMember> | IMember, boolean]>,
  fetchOneAndUpdate(guildId: string, userId: string, query: UpdateQuery<IMember>): Promise<HydratedDocument<IMember>>,
}

const MemberSchema = new Schema<IMember, MemberModel>({
  userId: { type: String, required: true }, // User ID
  guildId: { type: String, required: true }, // Guild ID
  values: {
      xpMultiplier: { type: Number, default: 1 }, // XP multiplier
      xpAmount: { type: Number, default: 0 }, // XP amount
      levelAmount: { type: Number, default: 1 }, // Level amount
  },
  metadata: {
      createdAt: { type: Date, default: () => new Date() }, // When entry was created
      lastModified: Date // When entry was last modified
  }
}, { autoIndex: true })

/**
 * @name fetchOneOrCreate
 * @description Fetches members data otherwise creates it if it doesn't exist
 * @param guildId ID of the guild associated with the data
 * @param userId ID of the user associated with the data
 * @returns Tuple [data: Document | IMember, hitCache: boolean]
 */
MemberSchema.static("fetchOneOrCreate", async function(guildId: string, userId: string) {
  // Find in cache
  if (redis.isReady) {
    const data = await redis.get(`member:${guildId}-${userId}`);
    if (data) return [JSON.parse(data) as IMember, true];
  } else console.warn("[ REDIS ] - Problem connecting to redis for Member.fetchOneOrCreate");

  // Find data otherwise create
  const data = await Member.findOne({ guildId, userId }) ?? await Member.create({ guildId, userId });
  if (redis.isReady) {
    await redis.set(`member:${guildId}-${userId}`, JSON.stringify(data), { EX: config.constraints.cache_expiry });
  }
  return [data, false];
})

/**
 * @name fetchOneAndUpdate
 * @description Fetches members data and updates it with the query
 * @param guildId ID of the guild associated with the data
 * @param userId ID of the user associated with the data
 * @param query The query for updating the data
 * @returns Updated document
 */
MemberSchema.static("fetchOneAndUpdate", async function(guildId: string, userId: string, query: UpdateQuery<IMember>) {
  // Update data
  query.$set = query.$set ?? {};
  query.$set["metadata.lastModified"] = new Date();
  const data = await Member.findOneAndUpdate({ guildId, userId }, query, { new: true, runValidators: true, upsert: true });

  // Add to cache
  if (redis.isReady) {
    await redis.set(`member:${guildId}-${userId}`, JSON.stringify(data), { EX: config.constraints.cache_expiry });
  } else console.warn("[ REDIS ] - Problem connecting to redis for Member.fetchOneAndUpdate");

  return data;
})

export const Member = model<IMember, MemberModel>('Member', MemberSchema);