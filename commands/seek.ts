import { nothingPlaying } from './../func/nothingPlaying';
import { startMusic } from './../func/startMusic';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const seek = async (args: string[], serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
  log(`Перемотка на ${args.toString()}`)

  const timeArr = args[0].split(":")
  let seekTime = 0
  
  if (
    timeArr.length > 2 || 
    timeArr.length === 0 ||
    timeArr.find(el => isNaN(+el))
  ) return serverQueue.textChannel.send(':no_entry: Неверный формат')

  if (timeArr.length > 1) seekTime += +timeArr[0] * 60 + +timeArr[1]
  else seekTime += +timeArr[0]

  serverQueue.skippedTime = seekTime 
  startMusic(serverQueue, seekTime)
}