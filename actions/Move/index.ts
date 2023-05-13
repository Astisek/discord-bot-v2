import EmptyCommand from '../../models/EmptyCommand';
import MusicPlayer from '../../service/MusicPlayer';
import Skip from '../Skip';

class Move extends EmptyCommand {
  protected static command: string[] = ["move", "m"]

  public execute = async () => {
    const prevPos = +this.args[0] - 1;
    const nextPos = +this.args[1] - 1;

    if (isNaN(prevPos) || isNaN(nextPos)) return;

    const songs = this.channel.songs;

    const element = songs[prevPos];
    songs.splice(prevPos, 1);
    songs.splice(nextPos, 0, element);

    this.logger(`Track ${prevPos} moved to ${nextPos} (${element.title})`)

    if (prevPos === 0) {
      await new Skip(this.channel, this.args, this.message).execute();
    }
    if (nextPos === 0) {
      await new MusicPlayer(this.channel, this.voiceConnection, this.player).start();
    }
  };
}

export default Move;
