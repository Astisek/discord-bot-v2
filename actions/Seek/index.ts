import EmptyCommand from '../../models/EmptyCommand';
import MusicPlayer from '../../service/MusicPlayer';

class Seek extends EmptyCommand {
  public execute = async () => {
    const timeArr = this.args[0].split(':');
    let seekTime = 0;

    if (timeArr.length > 2 || timeArr.length === 0 || timeArr.find((el) => isNaN(+el))) return;

    if (timeArr.length > 1) seekTime += +timeArr[0] * 60 + +timeArr[1];
    else seekTime += +timeArr[0];

    this.channel.skippedTime = seekTime;
    new MusicPlayer(this.channel, this.voiceConnection, this.player).start()
    this.logger(`Seek in ${seekTime} sec`)
  };
}

export default Seek;
