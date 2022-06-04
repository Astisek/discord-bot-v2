import {Document, Model} from "mongoose";
import { ISong } from "../Song/model";

export interface IChannel extends Document {
  channelId: string;
  textChannel: string;
  voiceChannel: string;
  songs: ISong[];
  volume: number;
  playing: boolean;
  repeat: boolean;
  skippedTime: number;
  autoPlay: boolean;
}

export type IChannelModel = IChannel
