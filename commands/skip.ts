import { nothingPlaying } from '../func/chatActions/nothingPlaying';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const skip = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
  if (serverQueue.repeat) serverQueue.songs.shift()

  log("Skip")
  
  serverQueue.dispatcher?.end()
}