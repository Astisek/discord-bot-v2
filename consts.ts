import { notConnected } from "./func/chatActions/notConnected";
import Discord from "discord.js";

export enum SongTypeEnum {
  youtube = "YOUTUBE",
  custom = "CUSTOM",
}

export enum ImageEnum {
  customTrackRandom = "https://i.ibb.co/nsNZHyh/ezgif-2-3f16e04466e5.gif",
  customTrack = "https://i.ibb.co/LJSgzXY/1528742576-untitled.png",
}

export type ISong = {
  type: SongTypeEnum;
  title: string;
  url: string;
  length: number;
  image: string;
};

export type IQueue = {
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel;
  voiceChannel: Discord.VoiceChannel;
  songs: ISong[];
  volume: number;
  playing: boolean;
  repeat: boolean;
  skippedTime: number;
  autoPlay: boolean;

  connection: Discord.VoiceConnection | null;
  dispatcher: Discord.StreamDispatcher | null;
  delete: () => void;

  finding: Map<string, any>;

  disconnectTimeOut?: NodeJS.Timeout;
};

export const serverQueueExample = (
  message: Discord.Message,
  globalQueue: Map<string, IQueue>
): IQueue => ({
  textChannel: message.channel,
  voiceChannel: message.member?.voice.channel as Discord.VoiceChannel,
  connection: null,
  dispatcher: null,
  songs: [],
  volume: 1,
  playing: false,
  finding: new Map(),
  repeat: false,
  skippedTime: 0,
  autoPlay: false,
  delete: () => globalQueue.delete(message.guild?.id || ""),
});

export const updateVoice = (serverQueue: IQueue, message: Discord.Message) => {
  const voiceChannel = message.member?.voice.channel as Discord.VoiceChannel;

  if (!voiceChannel) return notConnected(serverQueue.textChannel);

  serverQueue.voiceChannel = voiceChannel;
};
