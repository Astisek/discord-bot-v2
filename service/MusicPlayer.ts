import {
  AudioPlayer,
  VoiceConnection,
  createAudioResource,
  StreamType,
  AudioPlayerStatus,
  createAudioPlayer,
} from "@discordjs/voice";
import ytdl from "ytdl-core";

import Channel from "../models/Channel";
import Notification from "../service/Notification";

import { IChannel, ISong, SongTypeEnum } from "../models/Channel/model";
import { createFFmpegStream } from "./ffmpegStream";
import { logger } from "./logger";
import { EmbedCreater } from "./EmbedCreater";
import { fancyTimeFormat } from "../helpers/fancyTime";
import { createYouTubeUrl } from "../helpers/createYoutubeUrl";
import Skip from "../actions/Skip";

class MusicPlayer {
  constructor(
    private channel: IChannel,
    private voiceConnection?: VoiceConnection,
    private player?: AudioPlayer
  ) {}

  public start = async () => {
    const currentSong = this.channel.songs[0];

    const stream = this.streamSelection(currentSong, this.channel.skippedTime);
    this.logger(
      `Stream Selected ${`with skip time ${this.channel.skippedTime}`}`
    );

    if (!this.player) {
      this.player = createAudioPlayer();
      this.player.on(AudioPlayerStatus.Idle, this.endMusicHandler);
      this.player.on("error", (e) => console.log(e));
      this.player.on("debug", (e) => console.log(e));
      this.logger("New Player Created");
    }

    this.checkUrlOnAvailable(currentSong.url);

    const ffmpegStream = createFFmpegStream(stream, {
      seek: this.channel.skippedTime || 0,
      fmt: "s16le",
    });

    ffmpegStream.on('error', e => console.log(e))

    const resource = createAudioResource(ffmpegStream, {
      inputType: StreamType.Raw,
      inlineVolume: true,
    });
    this.logger("Resource created");
    resource.volume?.setVolume(this.channel.volume);
    this.voiceConnection?.subscribe(this.player);
    this.player.play(resource);
    this.logger("Played");
  };

  private async checkUrlOnAvailable(url: string) {
    try {
      await ytdl.getInfo(url);
    } catch (e) {
      Notification.send(this.channel, "Что-то пошло не так.");
      this.skip(this.channel);
      await this.channel.update(this.channel);
      await this.start();
    }
  }

  private endMusicHandler = async () => {
    const channel = (await Channel.findById(this.channel._id)) || this.channel;
    this.channel = channel;
    this.logger("End Track");
    this.channel.skippedTime = 0;

    if (this.channel.autoPlay && this.channel.songs.length === 1) {
      const autoplayTrack = await this.getAutoplayTrack();
      if (autoplayTrack) {
        this.channel.songs.push(autoplayTrack);
        const { image, title, url, songLength } = autoplayTrack;
        Notification.send(
          this.channel,
          undefined,
          EmbedCreater.addSongEmbed(title, url, image || "", true, songLength)
        );
        this.logger(
          `Autoplay added: ${autoplayTrack.url}, autoPlayPool lenght: ${this.channel.autoPlayPool.length}`
        );
      }
    }

    if (!channel.repeat) {
      this.skip(channel);
    }

    if (this.channel.songs.length) {
      this.start();
    }

    this.channel.update(this.channel);
  };

  private skip = (channel: IChannel) => {
    this.logger("Deleted first");
    channel.songs.shift();
  };

  private streamSelection = (song: ISong, begin: number = 0) => {
    switch (song.inputType) {
      case SongTypeEnum.youtube:
        return ytdl(createYouTubeUrl(song.url), {
          begin: begin * 1000,
          highWaterMark: 1 << 25,
          filter: "audioonly",
        });
      case SongTypeEnum.custom:
        return song.url;
      default:
        return song.url;
    }
  };
  protected logger(text: string) {
    logger.debug(`${this.channel.id}: *Player: ${text}`);
  }

  private async getAutoplayTrack(): Promise<ISong | undefined> {
    try {
      const lastSong = this.channel.songs[0];
      if (lastSong.inputType !== SongTypeEnum.youtube) return;

      const { related_videos } = await ytdl.getInfo(
        createYouTubeUrl(lastSong.url)
      );
      let videoId = 0;

      while (
        this.channel.autoPlayPool.find(
          (el) => el === related_videos[videoId].id
        )
      ) {
        videoId++;
      }

      const {
        thumbnails,
        length_seconds = 0,
        title = "",
        id,
      } = related_videos[videoId];

      this.channel.autoPlayPool.push(id || "");
      return {
        image: thumbnails[0].url,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        inputType: SongTypeEnum.youtube,
        songLength: +length_seconds,
      };
    } catch (e) {
      Notification.send(this.channel, "Что-то пошло не так.");
      logger.error(e);
    }
  }
}

export default MusicPlayer;
