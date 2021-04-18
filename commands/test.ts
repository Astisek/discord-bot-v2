import { IQueue } from '../consts';
import Discord from 'discord.js';

export const test = async (message: Discord.Message, args: string[], serverQueue: IQueue) => {
  console.log(serverQueue)
  console.log(serverQueue.songs)
}