import ytdl from 'ytdl-core-discord';
import {
  AudioPlayer,
  VoiceConnection,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  createAudioPlayer,
} from '@discordjs/voice';
import { IChannel, ISong, SongTypeEnum } from '../models/Channel/model';
import Channel from '../models/Channel';

class MusicPlayer {
  constructor(private channel: IChannel, private voiceConnection?: VoiceConnection, private player?: AudioPlayer) {}

  public start = async () => {
    const stream = await this.streamSelection(this.channel.songs[0]);
    if (!this.player) {
      this.player = createAudioPlayer();
      this.voiceConnection?.subscribe(this.player);
      this.player.on(AudioPlayerStatus.Idle, this.endMusicHandler);
    }
    const resource = createAudioResource(stream, {
      inputType: StreamType.Opus,
      inlineVolume: true,
    });

    this.player.play(resource);
  };

  private endMusicHandler = async () => {
    this.channel = await Channel.findById(this.channel._id) || this.channel
    if (!this.channel.repeat) {
      this.channel.songs.shift();
    }
    if (this.channel.songs.length) {
      this.start();
    }
    this.channel.save();
  };

  private streamSelection = (song: ISong, begin?: number) => {
    switch (song.inputType) {
      case SongTypeEnum.youtube:
        return ytdl(song.url, {
          highWaterMark: 1 << 25,
          filter: 'audioonly',
          quality: 'highestaudio',
          begin,
        });
      case SongTypeEnum.custom:
        return song.url;
      default:
        return song.url;
    }
  };
}

export default MusicPlayer;
