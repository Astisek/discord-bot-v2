import Discord from 'discord.js'

export enum SongTypeEnum {
  youtube = "YOUTUBE",
  custom = "CUSTOM",
}

export type ISong = {
  type: SongTypeEnum
  title: string
  url: string
  length: number
}

export type IQueue = {
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
  voiceChannel: Discord.VoiceChannel,
  songs: ISong[],
  volume: number,
  playing: boolean,
  repeat: boolean,
  skippedTime: number

  connection: Discord.VoiceConnection | null, 
  dispatcher: Discord.StreamDispatcher | null,
  
  finding: Map<string, any>
}

export const serverQueueExample = (message: Discord.Message): IQueue => ({
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
})

