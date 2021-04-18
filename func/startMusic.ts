import ytdl from 'discord-ytdl-core';
import { IQueue, ISong, SongTypeEnum } from '../consts';
import Discord from 'discord.js';

export const startMusic = async (serverQueue: IQueue, seekTImeSec?: number) => {
  serverQueue.playing = true

  serverQueue.dispatcher = serverQueue.connection?.play(streamSelection(serverQueue.songs[0], seekTImeSec), {volume: serverQueue.volume, type: 'opus'}) as Discord.StreamDispatcher
  
  serverQueue.dispatcher.on('finish', () => {
    serverQueue.skippedTime = 0
    if (!serverQueue.repeat) serverQueue.songs.shift()
    
    if (serverQueue.songs.length != 0) startMusic(serverQueue)
    else serverQueue.playing = false;
  });

}

const streamSelection = (song: ISong, seek?: number) => {
  switch (song.type) {
    case SongTypeEnum.youtube: 
      return ytdl(song.url, {
        filter: 'audioonly', 
        opusEncoded: true,
        seek,
        encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
      }) || ""
      
    default: return song.url
  }
}
