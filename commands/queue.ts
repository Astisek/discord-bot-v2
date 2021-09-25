import { nothingPlaying } from '../func/chatActions/nothingPlaying';
import { fancyTimeFormat } from './../func/fancyTime';
import { createEmbed } from '../func/chatActions/createEmbed';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const queue = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
  log(`Начало queue`)

  const embed = createEmbed('Текущий плейлист', 'Треки в плейлисте:')

  serverQueue.songs.forEach((el, index) => {
    embed.addField(
      `${index + 1}. ${el.title} ${(index === 0 ? `(Текущий)` : '')}`,
      `Длительность: ${fancyTimeFormat(el.length)}`
    )
  })

  serverQueue.textChannel.send(embed)
}