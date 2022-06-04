import mongoose, { Schema } from "mongoose";

import { SchemasEnum } from "..";
import { IChannel, ISong } from "./model";

const SongSchema = new Schema<ISong>({
  image: { type: "String", required: true },
  length: { type: "Number", required: true },
  title: { type: "String", required: true },
  inputType: { type: "String", required: true },
  url: { type: "String", required: true },
});

const schema = new Schema<IChannel>({
  autoPlay: { type: "Boolean", required: true },
  channelId: { type: "String", required: true },
  playing: { type: "Boolean", required: true },
  repeat: { type: "Boolean", required: true },
  skippedTime: { type: "Number", required: true },
  songs: [SongSchema],
  textChannel: { type: "String", required: true },
  voiceChannel: { type: "String", required: true },
  volume: { type: "Number", required: true },
});

const Channel = mongoose.model<IChannel>(SchemasEnum.CHANNEL, schema);

export default Channel;
