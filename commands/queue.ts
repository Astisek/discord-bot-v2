import { nothingPlaying } from './../func/nothingPlaying';
import { fancyTimeFormat } from './../func/fancyTime';
import { createEmbed } from './../func/createEmbed';
import { IQueue } from '../consts';

export const queue = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)

  // embed=discord.Embed(title="Текущий плейлист", description="Треки в плейлисте:", color=0xd12929)
  // embed.add_field(name="1. ASDasd", value="Длительность: 30:10", inline=False)

  const embed = createEmbed('Текущий плейлист', 'Треки в плейлисте:')

  serverQueue.songs.forEach((el, index) => {
    embed.addField(
      `${index + 1}. ${el.title} ${(index === 0 && `(Текущий)`)}`,
      `Длительность: ${fancyTimeFormat(el.length)}`
    )
  })

  serverQueue.textChannel.send(embed)
}