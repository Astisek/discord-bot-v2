import EmptyCommand from '../../models/EmptyCommand';
import MusicPlayer from '../../service/MusicPlayer';

class Skip extends EmptyCommand {
  public execute = async () => {
    try {
      if (this.channel.songs.length) {
        this.channel.songs.shift();
        if (this.channel.songs.length) {
          const player = new MusicPlayer(this.channel, this.voiceConnection, this.player);

          player.start();
        }
        this.channel.save();
      }
    } catch (e) {
      this.onError(e);
    }
  };
}

export default Skip;
