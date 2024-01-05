import { model, Schema, Model, HydratedDocument } from 'mongoose';

interface IMember  {
  userId: string,
  guildId: string,
  values: {
    infractions: [{
      action?: string,
      reason?: string,
      executor?: string,
      at?: Date,
      until?: Date
      id: number
    }],
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
  getByIds(guildId: string, userId: string, dontInit?: boolean): Promise<HydratedDocument<IMember>>
}

const MemberSchema = new Schema<IMember, MemberModel>({
  userId: { type: String, required: true }, // User ID
  guildId: { type: String, required: true }, // Guild ID
  values: {
      infractions: [{action: String, reason: String, executor: String, at: Date, until: Date, id: Number}],
      xpMultiplier: { type: Number, default: 1 },
      xpAmount: { type: Number, default: 0 },
      levelAmount: { type: Number, default: 1 },
  },
  metadata: {
      createdAt: { type: Date, default: new Date() }, // When entry was created
      lastModified: Date // When entry was last modified
  }
})

MemberSchema.pre("save", function(next) {
  this.metadata.lastModified = new Date()
  next()
})

MemberSchema.static("getByIds", async function(guildId: string, userId: string, dontInit?: boolean) {
  let data = await Member.findOne({ guildId: guildId, userId: userId })
  if (!data && !dontInit) {
      data = new Member({
          guildId: guildId,
          userId: userId
      })
      await data.save()
  }
  return data
})

export const Member = model<IMember, MemberModel>('Member', MemberSchema);