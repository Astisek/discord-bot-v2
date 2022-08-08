import ytdl from 'ytdl-core-discord';
import {
  AudioPlayer,
  VoiceConnection,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  createAudioPlayer,
} from '@discordjs/voice';
import fluentFfmpeg from 'fluent-ffmpeg'

import Channel from '../models/Channel';

import { fancyTimeFormat } from './../helpers/fancyTime';
import { IChannel, ISong, SongTypeEnum } from '../models/Channel/model';
import { logger } from './logger';

class MusicPlayer {
  constructor(
    private channel: IChannel,
    private voiceConnection?: VoiceConnection,
    private player?: AudioPlayer,
  ) {}

  public start = async () => {
    const stream = await this.streamSelection(this.channel.songs[0], this.channel.skippedTime);
    this.logger(`Stream Selected ${`with skip time ${this.channel.skippedTime}`}`)

    if (!this.player) {
      this.player = createAudioPlayer();
      this.voiceConnection?.subscribe(this.player);
      this.player.on(AudioPlayerStatus.Idle, this.endMusicHandler);
      this.player.on('error', (e) => console.log(e))
      this.player.on('debug', (e) => console.log(e))
      this.logger('New Player Created')
    }
    let editedStream = fluentFfmpeg({source: stream}).audioCodec('libopus').setStartTime(this.channel.skippedTime).toFormat('ogg')
    // @ts-ignore
    const resource = createAudioResource(editedStream, {
      inputType: StreamType.Opus,
      inlineVolume: true,
    });
    this.logger('Resource created')
    resource.volume?.setVolume(this.channel.volume)
    this.player.play(resource);
    this.logger('Played')
  };

  private endMusicHandler = async () => {
    const channel = (await Channel.findById(this.channel._id)) || this.channel;
    this.channel = channel
    this.logger('End Track')
    this.channel.skippedTime = 0;
    if (!channel.repeat) {
      this.logger('Deleted first')
      this.channel.songs.shift();
    }
    if (this.channel.songs.length) {
      this.start();
    }
    this.channel.save();
  };

  private streamSelection = (song: ISong, begin: number = 0) => {
    switch (song.inputType) {
      case SongTypeEnum.youtube:
        return ytdl(song.url, {
          highWaterMark: 1 << 25,
          filter: 'audioonly',
          quality: 'highestaudio',
          begin: fancyTimeFormat(begin),
        });
      case SongTypeEnum.custom:
        return song.url;
      default:
        return song.url;
    }
    
  };
  protected logger(text: string) {
    logger.debug(`${this.channel.id}: *Player: ${text}`)
  }
}

export default MusicPlayer;
