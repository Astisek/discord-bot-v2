import { Message } from 'discord.js';
import {Document} from "mongoose";
import Join from "../actions/Join";
import Leave from "../actions/Leave";
import Play from "../actions/Play";
import { IChannel } from "../models/Channel/model";
import EmptyCommand from "../models/EmptyCommand";

class ExecuteCommand {
  private channel: IChannel
  private args: string[];
  private Command?: typeof EmptyCommand;

  constructor(command: string, args: string[], channel: IChannel, protected message: Message) {
    this.channel = channel;
    this.args = args;
    switch (command.toLowerCase()) {
      case "join":
      case "j":
        this.Command = Join
        break;

      case "leave":
      case "l":
        this.Command = Leave
        break;

      case "play":
      case "p":
        this.Command = Play
        break;
      case "s":
        //   skip(serverQueue);
        //   break;

        // case "pause":
        //   pause(serverQueue);
        //   break;

        // case "resume":
        //   resume(serverQueue);
        //   break;

        // case "repeat":
        //   repeat(serverQueue);
        //   break;

        // case "queue":
        // case "q":
        //   queue(serverQueue);
        //   break;

        // case "move":
        // case "m":
        //   move(message, args, serverQueue);
        //   break;

        // case "nowplaying":
        // case "np":
        //   nowPlaying(serverQueue);
        //   break;

        // case "seek":
        //   seek(args, serverQueue);
        //   break;
        // case "clear":
        //   clear(serverQueue);
        //   break;
        // case "volume":
        //   volume(serverQueue, args)
        //   break
        // case "custom":
        // case "c":
        //   custom(serverQueue, message, args)
        //   break
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
      const command = new this.Command(channel, args, message)
      command?.execute();
    }
    
  }
}

export default ExecuteCommand;
