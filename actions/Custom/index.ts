import { ISong, SongTypeEnum } from '../../models/Channel/model';
import EmptyCommand from '../../models/EmptyCommand';

class Custom extends EmptyCommand {
  public execute = async () => {
    const file = this.message.attachments.first();
    const customUrl = this.args[0];
    if (!file && !customUrl) {
      this.sendMessage(':no_entry: Файл не найден :face_with_monocle: ');
      return
    }
    this.connectToVoice();

    const song: ISong = {
      image: null,
      inputType: SongTypeEnum.custom,
      songLength: 0,
      title: file?.name || 'Custom Url',
      url: file?.url || customUrl,
    };

    this.channel.songs.push(song);
    this.sendAddSongEmbed(song.title, song.url)

    await this.startPlayerIfNeed()
    this.logger(`Added custom track ${song.title} in ${song.url}`)
  };

  private sendAddSongEmbed = async (title: string, url: string) => {
    await this.sendEmbed(`Добавлено в очередь`, undefined, (embed) => {
      embed.addField(title, url);
    });
  };
}

export default Custom;
