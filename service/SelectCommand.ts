import { Message } from 'discord.js';
import {Autoplay} from '../actions/Autoplay';
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
import ResumePlay from '../actions/ResumePlay';
import { IChannel } from '../models/Channel/model';
import EmptyCommand from '../models/EmptyCommand';

class ExecuteCommand {
  private Command?: typeof EmptyCommand;
  private commandModuleList: typeof EmptyCommand[] = [
    Join,
    Leave,
    Play,
    Skip,
    Pause,
    Resume,
    Repeat,
    Queue,
    Move,
    NowPlaying,
    Seek,
    Clear,
    Volume,
    Custom,
    Autoplay,
    ResumePlay,
  ]

  constructor(
    private command: string,
    private args: string[],
    private channel: IChannel,
    protected message: Message,
  ) {
    this.execute();
  }

  private execute = async () => {
    const lowerCommand = this.command.toLowerCase()
    
    this.Command = this.commandModuleList.find(cm => cm.getCommands().find(st => st === lowerCommand))
    
    if (this.Command) {
      const command = new this.Command(this.channel, this.args, this.message);
      const postActions = await command?.execute();
      if (!postActions?.dontSave) {
        await this.channel.update(this.channel);
      }
    }
  };
}

export default ExecuteCommand;
