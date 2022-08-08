import {Document, Model} from "mongoose";

export interface IChannel extends Document {
  channelId: string;
  textChannel: string;
  voiceChannel: string;
  songs: ISong[];
  volume: number;
  repeat: boolean;
  skippedTime: number;
  autoPlay: boolean;
}

export enum SongTypeEnum {
  youtube = "YOUTUBE",
  custom = "CUSTOM",
}

export type ISong = {
  inputType: SongTypeEnum;
  title: string;
  url: string;
  songLength: number;
  image: string | null;
};
