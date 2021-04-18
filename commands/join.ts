import { IQueue } from '../consts';

export const join = async (serverQueue: IQueue) => {
  serverQueue.connection = await serverQueue.voiceChannel.join()
}