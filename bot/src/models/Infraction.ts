import { HydratedDocument, Model, model, Schema, Types, UpdateQuery } from 'mongoose';
import { Snowflake } from "discord.js";

export type LogAction = "Timeout" | "Ban" | "Kick" | "Timeout Removed" | "Unban" | "Nickname Change" | "Role Update" ;
export type LogChannelType = "memberLog" | "messageLog" | "modLog";

export interface IInfraction {
  logId: Types.ObjectId,
  data: {
    targetId: Snowflake,
    guildId: Snowflake,
    action: LogAction,
    modId: string,
    reason: string,
    until?: Date,
    at: Date
  }
}

interface InfractionModel extends Model<IInfraction> {
  fetchOne(logId: Types.ObjectId): Promise<HydratedDocument<IInfraction>>,
  fetchAllByMember(guildId: string, userId: string): Promise<HydratedDocument<IInfraction>[]>,
  fetchOneAndUpdate(logId: Types.ObjectId, query: UpdateQuery<IInfraction>): Promise<HydratedDocument<IInfraction>>
}

const InfractionSchema = new Schema<IInfraction, InfractionModel>({
  logId: Schema.Types.ObjectId,//{ type: ObjectId, required: true, unique: true },
  data: {
    targetId: String,
    guildId: String,
    action: String,
    modId: String,
    reason: String,
    until: Date,
    at: Date
  }
}, { autoIndex: true })

/**
 * @name fetchOneOrCreate
 * @description Fetches the data of an infraction
 * @param infractionId ID of the infraction
 * @returns Document | IInfraction
 */
InfractionSchema.static("fetchOne", async function(logId: Types.ObjectId) {
  // Find data
  const data = await Infraction.findOne({ logId });
  return data;
})

/**
 * @name fetchAllByMember
 * @description Fetches all the infractions for a member
 * @param guildId ID of the guild associated with the data
 * @param userId ID of the user associated with the data
 * @returns Document | IInfraction
 */
InfractionSchema.static("fetchAllByMember", async function(guildId: string, userId: string) {
  // Find data
  const data = await Infraction.find({ "data.guildId": guildId, "data.targetId": userId });
  return data;
})

/**
 * @name fetchOneAndUpdate
 * @description Fetches the data of an infraction and updates it with query
 * @param logId ID of the infraction
 * @param query The query for updating the data
 * @returns Updated document
 */
InfractionSchema.static("fetchOneAndUpdate", async function(logId: Types.ObjectId, query: UpdateQuery<IInfraction>) {
  // Update data
  const data = await Infraction.findOneAndUpdate({ logId }, query, { new: true, runValidators: true });
  return data;
})

export const Infraction = model<IInfraction, InfractionModel>('Infraction', InfractionSchema);