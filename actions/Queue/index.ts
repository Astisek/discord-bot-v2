import { fancyTimeFormat } from '../../helpers/fancyTime';
import EmptyCommand from '../../models/EmptyCommand';

class Queue extends EmptyCommand {
  protected static command: string[] = ["queue", "q"]

  public execute = async () => {
    if (!this.player || !this.channel.songs.length) {
      return
    }
    this.logger(`Queue with ${this.channel.songs.length} items`)
    await this.sendEmbed('Текущий плейлист', 'Треки в плейлисте:', embed => {
      this.channel.songs.forEach((el, index) => {
        embed.addField(
          `${index + 1}. ${el.title} ${(index === 0 ? `(Текущий)` : '')}`,
          `Длительность: ${fancyTimeFormat(el.songLength)}`
        )
      })
    })
  };
}

export default Queue;
 