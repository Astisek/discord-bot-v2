import { IQueue } from '../consts';
import Discord from 'discord.js';
import { send } from '../func/send';

export const test = async (message: Discord.Message, args: string[], serverQueue: IQueue) => {
  console.log(serverQueue)
  console.log(serverQueue.songs)
  send(serverQueue, "OK!")
}