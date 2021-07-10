import { IQueue } from '../consts';


export const leave = (serverQueue: IQueue) => {
  serverQueue.voiceChannel?.leave()
  serverQueue.connection = null
  serverQueue.delete()
}