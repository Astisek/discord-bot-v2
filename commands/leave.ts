import { IQueue } from '../consts';
import { log } from '../func/log';


export const leave = (serverQueue: IQueue) => {
  log('Отключение от войса')
  serverQueue.voiceChannel?.leave()
  serverQueue.connection = null
  serverQueue.delete()
  log('serverQueue удалён, от войса отключён')
}