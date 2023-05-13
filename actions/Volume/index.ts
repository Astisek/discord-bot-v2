import EmptyCommand from "../../models/EmptyCommand";

class Volume extends EmptyCommand {
  protected static command: string[] = ["volume"]

  public execute = async () => {
    const newVolume = +this.args[0];
    if (isNaN(newVolume) || newVolume > 1000) {
      this.sendMessage(
        ":no_entry: Неверное значение :face_with_hand_over_mouth:"
      );
      return;
    }
    
    this.playerState?.resource?.volume?.setVolume(newVolume);
    this.channel.volume = newVolume;

    this.sendMessage(`:scarf: Volume установлен на ${newVolume}`);
    this.logger(`Volume set to ${newVolume}`);
  };
}

export default Volume;
