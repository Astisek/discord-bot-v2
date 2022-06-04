import EmptyCommand from '../../models/EmptyCommand';
import Join from '../Join';
import querystring from 'querystring';
import ytdl from 'ytdl-core-discord';
import { fancyTimeFormat } from '../../helpers/fancyTime';
import { SongTypeEnum } from '../../models/Channel/model';
import StartMusic from '../../service/StartMusic';

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
  };

  private playYoutube = async (url: string) => {
    const params = querystring.decode(url.split('?')[1]);
    debugger
    if (params?.list) {
      await this.playPlayList(params.list.toString());
    } else {
      try {
        const autoPlay = this.channel.autoPlay;
        const song = await this.loadVideoInfo(url);

        this.channel.songs.push({
          ...song,
          inputType: SongTypeEnum.youtube,
        });
        await this.channel.save();

        const { title, image, length } = song;
        await this.sendEmbed(
          `Добавлено в очередь ${autoPlay ? '(AutoPlay)' : ''}`,
          undefined,
          (embed) => {
            embed
              .addField(title, url)
              .setImage(image)
              .setFooter({
                text: `Длительность: ${fancyTimeFormat(length)}`,
              });
          },
          autoPlay ? [224, 152, 43] : undefined,
        );
        
        const stream = new StartMusic(this.channel, this.voiceConnection)
        await stream.start()
        this.message.delete();
      } catch (e: any) {
        this.sendMessage(e.message);
        console.log(e);
      }
    }
  };

  private loadVideoInfo = async (url: string) => {
    const trackData = await ytdl.getInfo(url);

    const title = trackData.videoDetails.title;
    const length = +trackData.videoDetails.lengthSeconds;
    const image =
      trackData.videoDetails.thumbnails[trackData.videoDetails.thumbnails.length - 1].url;
    return {
      length,
      title,
      url,
      image,
    };
  };

  private playPlayList = async (list: string) => {};
}

export default Play;
