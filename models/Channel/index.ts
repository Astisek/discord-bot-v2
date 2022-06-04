import mongoose, { Schema } from "mongoose";
import { SchemasEnum } from "..";
import { IChannel } from "./model";

const schema = new Schema<IChannel>({
  autoPlay: { type: "Boolean", required: true },
  channelId: { type: "String", required: true },
  playing: { type: "Boolean", required: true },
  repeat: { type: "Boolean", required: true },
  skippedTime: { type: "Number", required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: SchemasEnum.SONG }],
  textChannel: { type: "String", required: true },
  voiceChannel: { type: "String", required: true },
  volume: { type: "Number", required: true },
});

const Channel = mongoose.model<IChannel>(SchemasEnum.CHANNEL, schema);

export default Channel;
