import EmptyCommand from "../../models/EmptyCommand";
import MusicPlayer from "../../service/MusicPlayer";

class Skip extends EmptyCommand {
  public execute = async () => {
    try {
      this.logger(`Skip (current length: ${this.channel.songs.length})`);
      this.channel.skippedTime = 0;
      const removeId = +this.args[0] - 1 || 0;
      const prevLenght = this.channel.songs.length;
      if (this.channel.songs.length) {
        this.channel.songs = this.channel.songs.filter(
          (el, index) => index !== removeId
        );
        if (prevLenght === this.channel.songs.length || removeId) return;
        if (this.channel.songs.length) {
          const player = new MusicPlayer(
            this.channel,
            this.voiceConnection,
            this.player
          );
          await player.start();
        } else {
          this.logger("Player stoped");
          this.player?.stop();
          this.unsubscribePlayer();
        }
      }
    } catch (e) {
      this.onError(e);
    }
  };
}

export default Skip;
