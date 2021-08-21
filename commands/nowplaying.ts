import { nothingPlaying } from './../func/nothingPlaying';
import { fancyTimeFormat } from './../func/fancyTime';
import { createEmbed } from './../func/createEmbed';
import { IQueue } from '../consts';

export const nowPlaying = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)

  const currentSong = serverQueue.songs[0]
  const streemTime = ~~((serverQueue.dispatcher?.streamTime as number / 1000) + serverQueue.skippedTime)
  const length = serverQueue.songs[0].length

  const currentPos = ~~((streemTime / length) * 20)
  let lengthString = ''

  for (let i = 0; i < 20; i++) {
    lengthString += currentPos === i ? "|" : '-'
  }  

  const embed = createEmbed('Сейчас воспроизводиться', 'Текущий трек:')
  embed.addField(currentSong.title, currentSong.url)
  embed.addField(
    'Длительность:', 
    `${fancyTimeFormat(streemTime)} ${lengthString} ${fancyTimeFormat(length)}`
  )

  serverQueue.textChannel.send(embed)
}