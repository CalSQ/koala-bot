import { model, Schema, Model, HydratedDocument, Document, UpdateQuery } from 'mongoose';
import { redis, config } from "../utils";

interface IUser  {
  userId: string,
  values: {
    robloxAccountId?: string,
  },
  metadata: {
    createdAt?: Date,
    lastModified?: Date
  }
}

interface UserModel extends Model<IUser> {
  fetchOneOrCreate(userId: string): Promise<[HydratedDocument<IUser> | IUser, boolean]>,
  fetchOneAndUpdate(userId: string, query: UpdateQuery<IUser>): Promise<HydratedDocument<IUser>>
}

const UserSchema = new Schema<IUser, UserModel>({
  userId: { type: String, required: true, unique: true }, // User ID
  values: {
    robloxAccountId: String, // Roblox ID of verified user
  },
  metadata: {
    createdAt: { type: Date, default: () => new Date() }, // When entry was created
    lastModified: Date // When entry was last modified
  }
}, { autoIndex: true })

/**
 * @name fetchOneOrCreate
 * @description Fetches users data otherwise creates it if it doesn't exist
 * @param userId ID of the user associated with the data
 * @returns Tuple [data: Document | IUser, hitCache: boolean]
 */
UserSchema.static("fetchOneOrCreate", async function(userId: string) {
  // Find in cache
  if (redis.isReady) {
    const data = await redis.get(`user:${userId}`);
    if (data) return [JSON.parse(data) as IUser, true];
  } else console.warn("[ REDIS ] - Problem connecting to redis for User.fetchOneOrCreate");

  // Find data otherwise create
  const data = await User.findOne({ userId }) ?? await User.create({ userId });
  if (redis.isReady) {
    await redis.set(`user:${userId}`, JSON.stringify(data), { EX: config.constraints.cache_expiry });
  }
  return [data, false];
})

/**
 * @name fetchOneAndUpdate
 * @description Fetches users data and updates it with the query
 * @param userId ID of the user associated with the data
 * @param query The query for updating the data
 * @returns Updated document
 */
UserSchema.static("fetchOneAndUpdate", async function(userId: string, query: UpdateQuery<IUser>) {
  // Update data
  query.$set = query.$set ?? {};
  query.$set["metadata.lastModified"] = new Date();
  const data = await User.findOneAndUpdate({ userId }, query, { new: true, runValidators: true, upsert: true });

  // Add to cache
  if (redis.isReady) {
    await redis.set(`user:${userId}`, JSON.stringify(data), { EX: config.constraints.cache_expiry });
  } else console.warn("[ REDIS ] - Problem connecting to redis for User.fetchOneAndUpdate");

  return data;
})

export const User = model<IUser, UserModel>('User', UserSchema);