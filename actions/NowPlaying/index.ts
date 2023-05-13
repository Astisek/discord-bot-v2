import { AudioPlayerPlayingState } from '@discordjs/voice';
import { fancyTimeFormat } from '../../helpers/fancyTime';
import EmptyCommand from '../../models/EmptyCommand';

class NowPlaying extends EmptyCommand {
  protected static command: string[] = ["nowplaying", "np"]

  public execute = async () => {
    const currentSong = this.channel.songs[0];
    if (!currentSong) {
      return
    } 
    const state = this.player?.state as AudioPlayerPlayingState;

    const streemTime = ~~(state.playbackDuration / 1000 + this.channel.skippedTime);
    const length = currentSong.songLength;

    const currentPos = ~~((streemTime / length) * 20);
    let lengthString = '';

    for (let i = 0; i < 20; i++) {
      lengthString += currentPos === i ? '।' : '‒';
    }

    this.logger(`Nowplaying ${currentSong.title}`)

    await this.sendEmbed('Сейчас воспроизводится', 'Текущий трек:', (embed) => {
      embed
        .addField(currentSong.title, currentSong.url)
        .addField(
          'Длительность:',
          `${fancyTimeFormat(streemTime)} ${lengthString} ${fancyTimeFormat(length)}`,
        );
    });
  };
}

export default NowPlaying;
