import { nothingPlaying } from './../func/nothingPlaying';
import { startMusic } from './../func/startMusic';
import { skip } from './skip';
import { IQueue } from '../consts';
import Discord from 'discord.js';
import { log } from '../func/log';

export const move = async (message: Discord.Message, args: string[], serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
  log(`Перематывание на ${args.toString()}`)

  const prevPos = +args[0] - 1
  const nextPos = +args[1] - 1

  if (!(prevPos && nextPos)) return serverQueue.textChannel.send(':no_entry: Неверный пормат')
  
  const songs = serverQueue.songs
  
  const element = songs[prevPos]
  songs.splice(prevPos, 1)
  songs.splice(nextPos, 0, element)
  
  if (prevPos === 0) skip(serverQueue)
  if (nextPos === 0) startMusic(serverQueue)
  
  log(`Перематывание на завершено`)
  serverQueue.textChannel.send(':white_check_mark:  Moved! :arrow_right: ')
}