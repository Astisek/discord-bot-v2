import EmptyCommand from '../../models/EmptyCommand';
import Join from '../Join';
import querystring from 'querystring';
import ytdl from 'ytdl-core-discord';
import { fancyTimeFormat } from '../../helpers/fancyTime';
import { SongTypeEnum } from '../../models/Channel/model';
import MusicPlayer from '../../service/MusicPlayer';
import ytpl from 'ytpl';

class Play extends EmptyCommand {
  public execute = async () => {
    await this.connectToVoice();
    const url = this.args[0];

    if (url.startsWith('https://www.youtube.com/')) {
      await this.playYoutube(url);
    } else if (url.startsWith('https://youtu.be/')) {
      const array = url.split('/');
      await this.playYoutube(`https://www.youtube.com/watch?v=${array[array.length - 1]}`);
    } else {
    }

    this.message.delete();
    if (!this.player && this.channel.songs.length) {
      const player = new MusicPlayer(this.channel, this.voiceConnection, this.player);
      await player.start();
    }
  };

  private playYoutube = async (url: string) => {
    const params = querystring.decode(url.split('?')[1]);
    if (params?.list) {
      await this.playPlayList(params.list.toString());
    } else {
      await this.playYoutubeByUrl(url);
    }
  };

  private playYoutubeByUrl = async (url: string) => {
    try {
      const autoPlay = this.channel.autoPlay;
      const song = await this.loadVideoInfo(url);

      this.channel.songs.push({
        ...song,
        inputType: SongTypeEnum.youtube,
      });
      await this.channel.save();

      const { title, image, songLength } = song;
      await this.sendAddSongEmbed(title, url, image, autoPlay, songLength);
    } catch (e: any) {
      this.onError(e);
    }
  };

  private sendAddSongEmbed = async (
    title: string,
    url: string,
    image: string,
    autoPlay: boolean,
    songLength: number,
  ) => {
    await this.sendEmbed(
      `Добавлено в очередь ${autoPlay ? '(AutoPlay)' : ''}`,
      undefined,
      (embed) => {
        embed
          .addField(title, url)
          .setImage(image)
          .setFooter({
            text: `Длительность: ${fancyTimeFormat(songLength)}`,
          });
      },
      autoPlay ? [224, 152, 43] : undefined,
    );
  };

  private loadVideoInfo = async (url: string) => {
    const trackData = await ytdl.getInfo(url);

    const title = trackData.videoDetails.title;
    const songLength = +trackData.videoDetails.lengthSeconds;
    const image =
      trackData.videoDetails.thumbnails[trackData.videoDetails.thumbnails.length - 1].url;
    return {
      songLength,
      title,
      url,
      image,
    };
  };

  private playPlayList = async (list: string) => {
    try {
      const { items, title, estimatedItemCount, bestThumbnail } = await ytpl(list);

      items.forEach((el) => {
        this.channel.songs.push({
          image: el.bestThumbnail.url || '',
          songLength: +(el.durationSec || 0),
          title: el.title,
          inputType: SongTypeEnum.youtube,
          url: el.shortUrl,
        });
      });

      await this.sendSecondaryEmbed('Добавлено в очередь', `Плейлист: ${title}`, (embed) => {
        embed.setImage(bestThumbnail.url || '').setFooter({
          text: `Количество треков: ${estimatedItemCount}`,
        });
      });
      this.channel.save();
    } catch (e: any) {
      this.onError(e);
    }
  };
}

export default Play;
