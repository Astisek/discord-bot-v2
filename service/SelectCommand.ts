import { Message } from 'discord.js';
import Clear from '../actions/Clear';
import Custom from '../actions/Custom';
import Join from '../actions/Join';
import Leave from '../actions/Leave';
import Move from '../actions/Move';
import NowPlaying from '../actions/NowPlaying';
import Pause from '../actions/Pause';
import Play from '../actions/Play';
import Queue from '../actions/Queue';
import Repeat from '../actions/Repeat';
import Resume from '../actions/Resume';
import Seek from '../actions/Seek';
import Skip from '../actions/Skip';
import Volume from '../actions/Volume';
import { IChannel } from '../models/Channel/model';
import EmptyCommand from '../models/EmptyCommand';

class ExecuteCommand {
  private Command?: typeof EmptyCommand;

  constructor(
    private command: string,
    private args: string[],
    private channel: IChannel,
    protected message: Message,
  ) {
    this.execute();
  }

  private execute = async () => {
    switch (this.command.toLowerCase()) {
      case 'join':
      case 'j':
        this.Command = Join;
        break;
        
      case 'leave':
      case 'l':
        this.Command = Leave;
        break;

      case 'play':
      case 'p':
        this.Command = Play;
        break;

      case 's':
      case 'skip':
        this.Command = Skip;
        break;

      case 'pause':
        this.Command = Pause;
        break;

      case 'resume':
        this.Command = Resume;
        break;

      case 'repeat':
        this.Command = Repeat;
        break;

      case 'queue':
      case 'q':
        this.Command = Queue;
        break;

      case 'move':
      case 'm':
        this.Command = Move;
        break;

      case 'nowplaying':
      case 'np':
        this.Command = NowPlaying;
        break;

      case 'seek':
        this.Command = Seek;
        break;

      case "clear":
        this.Command = Clear;
        break;

      case "volume":
        this.Command = Volume;
        break;
        
      case "custom":
      case "c":
        this.Command = Custom;
        break;
      // case "autoplay":
      // case "ap":
      //   autoPlay(serverQueue)
      //   break
      // case "help":
      //   help(message);
      //   break;

      // case "status":
      //   test(message, args, serverQueue);
      //   break;
    }
    if (this.Command) {
      const command = new this.Command(this.channel, this.args, this.message);
      const postActions = await command?.execute();
      if (!postActions?.dontSave) {
        await this.channel.save();
      }
    }
  };
}

export default ExecuteCommand;
