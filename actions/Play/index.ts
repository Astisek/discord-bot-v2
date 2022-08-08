import EmptyCommand from '../../models/EmptyCommand';
import querystring from 'querystring';
import ytdl from 'ytdl-core-discord';
import { fancyTimeFormat } from '../../helpers/fancyTime';
import { SongTypeEnum } from '../../models/Channel/model';
import ytpl from 'ytpl';
import Search from '../../models/Search';
import { MAX_SEARCH_POSITION, YOUTUBE_API } from '../../consts/app';
const searchYoutube = require('youtube-api-v3-search');

class Play extends EmptyCommand {
  public execute = async () => {
    await this.connectToVoice();
    this.logger('Connected to Voice')
    const url = this.args[0];

    if (url.startsWith('https://www.youtube.com/')) {
      await this.playYoutube(url);
    } else if (url.startsWith('https://youtu.be/')) {
      const array = url.split('/');
      await this.playYoutube(`https://www.youtube.com/watch?v=${array[array.length - 1]}`);
    } else {
      await this.playSearch(this.args.join(' '));
    }

    this.message.delete();
    await this.startPlayerIfNeed()
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

      const { title, image, songLength } = song;
      this.logger(`Play by url (${url})`)
      await this.sendAddSongEmbed(title, url, image, autoPlay, songLength);
    } catch (e) {
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

      this.logger(`Play by playlist (${items.length} tracks)`)

      await this.sendSecondaryEmbed('Добавлено в очередь', `Плейлист: ${title}`, (embed) => {
        embed.setImage(bestThumbnail.url || '').setFooter({
          text: `Количество треков: ${estimatedItemCount}`,
        });
      });
    } catch (e) {
      this.onError(e);
    }
  };

  private playSearch = async (q: string) => {
    const options = {
      q,
      part: 'snippet',
      type: 'video',
      maxResults: MAX_SEARCH_POSITION,
    };

    try {
      const res = await searchYoutube(YOUTUBE_API, options);

      const sendedEmbed = await this.sendEmbed(
        'Search',
        'Write your choice in the chat',
        (embed) => {
          for (let i = 0; i < res.items.length; i++) {
            embed.addField(
              `${i + 1}: ${res.items[i].snippet.title}`,
              res.items[i].snippet.channelTitle,
            );
          }
          embed.setFooter({
            text: 'Чтобы отменить поиск введите: "c" или "cancel"',
          });
        },
      );
      this.logger(`Play by search (${q})`)
      const searchResult = new Search({
        author: this.message.member?.id,
        results: res.items.map((el: any) => el.id.videoId),
        messageId: sendedEmbed.id,
      });
      await searchResult.save();
    } catch (e) {
      this.onError(e);
    }
  };
}

export default Play;
