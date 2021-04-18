import { nothingPlaying } from './../func/nothingPlaying';
import { IQueue } from '../consts';

export const skip = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
  if (serverQueue.repeat) serverQueue.songs.shift()
  
  serverQueue.dispatcher?.end()
}