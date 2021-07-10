import { createError } from './../func/createError';
import { startAutoDisconnect } from './../func/startAutoDisconnect';
import { IQueue } from '../consts';

export const join = async (serverQueue: IQueue) => {
  if (!serverQueue.voiceChannel) return createError(serverQueue, "Не подключён к голосовому каналу :face_with_raised_eyebrow:")
  serverQueue.connection = await serverQueue.voiceChannel.join()
  startAutoDisconnect(serverQueue)
}