import ytdl from 'ytdl-core-discord';
import { AudioPlayer, VoiceConnection, createAudioResource, StreamType } from '@discordjs/voice';
import { createAudioPlayer } from '@discordjs/voice';
import { IChannel, ISong, SongTypeEnum } from '../models/Channel/model';

class StartMusic {
  private player?: AudioPlayer;
  constructor(private channel: IChannel, private voiceConnection?: VoiceConnection) {}

  public start = async () => {
    this.channel.playing = true;
    const stream = await this.streamSelection(this.channel.songs[0])
    this.player = createAudioPlayer();
    const resource = createAudioResource(stream, {
      inputType: StreamType.Opus,
      inlineVolume: true,
    });
    
    this.voiceConnection?.subscribe(this.player);
    this.player.play(resource);

    // Определение типа потока
    // const type: Discord.StreamType | undefined =
    //   serverQueue.songs[0].type === SongTypeEnum.youtube ? 'opus' : undefined;

    // Создание диспатчера
    // serverQueue.dispatcher = serverQueue.connection?.play(
    //   streamSelection(serverQueue.songs[0], seekTImeSec),
    //   { volume: serverQueue.volume, type },
    // ) as Discord.StreamDispatcher;

    // // Ивент при окончании воспроизведения
    // serverQueue.dispatcher.on("finish", async () => {
    //   log(`Конец трека`);
    //   // Установка пропускания времени на 0
    //   serverQueue.skippedTime = 0;

    //   // Если включен autoPlay и последний трек, то добавить новый трек в плейлист
    //   if (
    //     serverQueue.autoPlay &&
    //     !serverQueue.repeat &&
    //     serverQueue.songs.length === 1
    //   ) {
    //     const nextTrack = await getAutoplaySong(serverQueue);
    //     if (nextTrack) {
    //       sendAddSongEmbeded(
    //         serverQueue.textChannel,
    //         nextTrack.title,
    //         nextTrack.url,
    //         nextTrack.length,
    //         nextTrack.image,
    //         true
    //       );
    //       serverQueue.songs.push(nextTrack);
    //     }
    //   }

    //   // Если включен repeat, то не удалять первый элемент массива
    //   if (!serverQueue.repeat) serverQueue.songs.shift();

    //   // Если ещё есть треки то рекурсия, а если нету завершение плейлиста
    //   if (serverQueue.songs.length !== 0) startMusic(serverQueue);
    //   else {
    //     endPlaylist(serverQueue);
    //   }
    // });
    // };
  };

  private streamSelection = (song: ISong, begin?: number) => {
    console.log(song.inputType);
    
    switch (song.inputType) {
      case SongTypeEnum.youtube:
        return (
          ytdl(song.url, {
            highWaterMark: 1 << 25,
            filter: 'audioonly',
            quality: 'highestaudio',
          })
        );
      case SongTypeEnum.custom:
        return song.url;
      default:
        return song.url;
    }
  };
}

export default StartMusic;
