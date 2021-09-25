import { createError } from "../../func/chatActions/createError";
import { IQueue, SongTypeEnum } from "./../../consts";
import ytdl from "discord-ytdl-core";
import { log } from "./../../func/log";
import { sendAddSongEmbeded } from "../../func/chatActions/addSong";
import querystring from "querystring";
import { youtubePlaylist } from "./youtubePlaylist";

export const youtube = async (url: string, serverQueue: IQueue) => {
  log(`Воспроизведение через youtube: ${url}`);
  const params = querystring.decode(url.split("?")[1]);
  if (params?.list) {
    await youtubePlaylist(serverQueue, params.list.toString());
  } else {
    try {
      const res = await ytdl.getInfo(url);

      const title = res.videoDetails.title;
      const length = +res.videoDetails.lengthSeconds;
      const image =
        res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url;

      serverQueue.songs.push({
        length,
        title,
        type: SongTypeEnum.youtube,
        url,
        image,
      });

      sendAddSongEmbeded(serverQueue.textChannel, title, url, length, image);
    } catch (e: any) {
      createError(serverQueue, e.message);
    }
  }
};
