import EmptyCommand from "../../models/EmptyCommand";

class Clear extends EmptyCommand {
  protected static command: string[] = ["clear"]

  public execute = async () => {
    const songsLength = this.channel.songs.length
    this.channel.songs = songsLength ? [this.channel.songs[0]] : []

    this.sendMessage(`:candle: Плейлист очищен`)
    this.logger('Playlist cleared')
  };
}

export default Clear;


