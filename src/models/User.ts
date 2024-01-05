import { model, Schema, Model, HydratedDocument, Document } from 'mongoose';

interface IUser  {
  userId: string,
  values: {
    robloxAccountId?: string,
    games: {
      nextWordle?: number
    },
    states: {
      wordleCount?: number
    }
  },
  metadata: {
    createdAt?: Date,
    lastModified?: Date
  }
}

interface UserModel extends Model<IUser> {
  getById(userId: string, dontInit?: boolean): Promise<HydratedDocument<IUser>>
}

const UserSchema = new Schema<IUser, UserModel>({
  userId: { type: String, required: true, unique: true }, // User ID
  values: {
    robloxAccountId: String, // Roblox ID of verified user
    lastSuggestion: Date,
    games: {
      nextWordle: Number
    },
    stats: {
      wordleCount: { type: Number, default: 0 }
    }
  },
  metadata: {
    createdAt: { type: Date, default: new Date() }, // When entry was created
    lastModified: Date // When entry was last modified
  }
})

UserSchema.pre("save", function(next) {
  this.metadata.lastModified = new Date()
  next()
})

UserSchema.static("getById", async function(userId: string, dontInit?: boolean) {
  let data = await User.findOne({ userId: userId })
  if (!data && !dontInit) {
      data = new User({
          userId: userId
      })
      await data.save()
  }
  return data
})

export const User = model<IUser, UserModel>('User', UserSchema);