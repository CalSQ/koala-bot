import { model, Schema, Model, HydratedDocument } from 'mongoose';

interface IGuild {
  guildId: string,
  values: {
    options: {
      messageLog?: string,
      memberLog?: string,
      modLog?: string
    },
    modLogCount: number,
    lastLog: string
  },
  metadata: {
    createdAt?: Date,
    lastModified?: Date
  }
}

interface GuildModel extends Model<IGuild> {
  getById(guildId: string, dontInit?: boolean): Promise<HydratedDocument<IGuild>>
}

const GuildSchema = new Schema<IGuild, GuildModel>({
  guildId: { type: String, required: true, unique: true }, // Guild ID
  values: {
      options: {
          messageLog: String, // Log for deleted & updated messages
          modLog: String, // Log for moderation and reports
          memberLog: String // Log for member joins
      },
      modLogCount: { type: Number, default: 0 }, // Number of mod logs
      lastLog: { type: String, default: "" }
  },
  metadata: {
      createdAt: { type: Date, default: new Date() }, // When entry was created
      lastModified: { type: Date, default: new Date() } // When entry was last modified
  }
})

GuildSchema.pre("save", function(next) {
  this.metadata.lastModified = new Date()
  next()
})

GuildSchema.static("getById", async function(guildId: string, dontInit?: boolean) {
  let data = await Guild.findOne({ guildId: guildId })
  if (!data && !dontInit) {
      data = new Guild({
          guildId: guildId
      })
      await data.save()
  }
  return data
})

export const Guild = model<IGuild, GuildModel>('Guild', GuildSchema);