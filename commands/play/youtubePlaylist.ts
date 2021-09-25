import { createSecondaryEmbed } from './../../func/chatActions/createEmbed';
import ytpl from 'ytpl';
import { createError } from '../../func/chatActions/createError';
import { log } from '../../func/log';
import { IQueue, SongTypeEnum } from './../../consts';
import { playMusic } from '../../func/playMusic';
import { youtube } from './youtube';


export const youtubePlaylist = async (serverQueue: IQueue, list: string) => {
  log(`Плейлист ${list}`)
  try {
    const {items, title, estimatedItemCount, bestThumbnail} = await ytpl(list)

    items.forEach(el => {
      serverQueue.songs.push({
        image: el.bestThumbnail.url || "",
        length: +(el.durationSec || 0),
        title: el.title,
        type: SongTypeEnum.youtube,
        url: el.shortUrl
      })
    })

    const embed = createSecondaryEmbed('Добавлено в очередь', `Плейлист: ${title}`)
      .setImage(bestThumbnail.url || "")
      .setFooter(`Количество треков: ${estimatedItemCount}`)
    await serverQueue.textChannel.send(embed)

    playMusic(serverQueue)
  } catch (e: any) {
    createError(serverQueue, e.message)
  }
}