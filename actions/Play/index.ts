import EmptyCommand from "../../models/EmptyCommand";
import Join from "../Join";
import querystring from "querystring";
import ytdl from "ytdl-core-discord";
import { SongTypeEnum } from "../../models/Song/model";
import { fancyTimeFormat } from "../../helpers/fancyTime";
import Notification from "../../service/Notification";

class Play extends EmptyCommand {
  public execute = async () => {
    await this.connectToVoice();
    const url = this.args[0];

    if (url.startsWith("https://www.youtube.com/")) {
      await this.playYoutube(url);
    } else if (url.startsWith("https://youtu.be/")) {
      const array = url.split("/");
      await this.playYoutube(
        `https://www.youtube.com/watch?v=${array[array.length - 1]}`
      );
    } else {
      
    }
  };

  private connectToVoice = async () => {
    const join = new Join(this.channel, this.args);
    await join.execute();
  };
  private playYoutube = async (url: string) => {
    const params = querystring.decode(url.split("?")[1]);
    if (params?.list) {
      await this.playPlayList(params.list.toString());
    } else {
      try {
        const trackData = await ytdl.getInfo(url);

        const title = trackData.videoDetails.title;
        const length = +trackData.videoDetails.lengthSeconds;
        const image =
          trackData.videoDetails.thumbnails[
            trackData.videoDetails.thumbnails.length - 1
          ].url;
        const autoPlay = this.channel.autoPlay;

        this.channel.songs.push({
          length,
          title,
          inputType: SongTypeEnum.youtube,
          url,
          image,
        });

        await this.channel.save();
        await this.sendEmbed(
          `Добавлено в очередь ${autoPlay ? "(AutoPlay)" : ""}`,
          undefined,
          (embed) => {
            embed
              .addField(title, url)
              .setImage(image)
              .setFooter({
                text: `Длительность: ${fancyTimeFormat(length)}`,
              });
          },
          autoPlay ? [224, 152, 43] : undefined
        );
      } catch (e: any) {
        this.sendMessage(e.message)
      }
    }
  };

  private playPlayList = async (list: string) => {};
}

export default Play;
