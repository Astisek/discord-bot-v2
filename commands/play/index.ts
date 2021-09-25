import { endAutoDisconnect } from '../../func/autoDisconnect';
import { playMusic } from '../../func/playMusic';
import { join } from "../join";
import { IQueue } from "../../consts";
import Discord from "discord.js";
import { log } from '../../func/log';
import { youtube } from './youtube';
import { search } from './search';

export const play = async (
  message: Discord.Message,
  args: string[],
  serverQueue: IQueue
) => {
  await join(serverQueue, message);
  log(`Play ${args.toString()}`)

  if (args[0].startsWith("https://www.youtube.com/"))
    await youtube(args[0], serverQueue);

  else if (args[0].startsWith("https://youtu.be/")) {
    const array = args[0].split("/");
    await youtube(
      `https://www.youtube.com/watch?v=${array[array.length - 1]}`,
      serverQueue
    );    
  } 
  
  else await search(args.join(" "), serverQueue, message);

  endAutoDisconnect(serverQueue)
  message.delete()

  playMusic(serverQueue)
};
