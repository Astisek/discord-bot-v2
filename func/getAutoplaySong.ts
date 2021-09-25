import ytdl from 'ytdl-core';
import { IQueue, ISong, SongTypeEnum } from './../consts';
import { createError } from './chatActions/createError';
import { log } from './log';

export const getAutoplaySong = async (serverQueue: IQueue): Promise<ISong | undefined> => {
  log(`Получение autoplay`)
  try {
    const lastUrl = serverQueue.songs[serverQueue.songs.length - 1].url

    const {related_videos} = await ytdl.getInfo(lastUrl)
    const { thumbnails, length_seconds = 0, title = "", id } = related_videos[0]

    log(`Autoplay получен`)
    return {
      image: thumbnails[0].url,
      length: +length_seconds,
      title,
      type: SongTypeEnum.youtube,
      url: `https://www.youtube.com/watch?v=${id}`,
    }
  } catch (e: any) {
    serverQueue.autoPlay = false
    createError(serverQueue, e.message)
  }
} 