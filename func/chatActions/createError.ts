import { IQueue } from '../../consts';
import { log } from '../log';

export const createError = (serverQueue: IQueue, message: any) => {
  serverQueue.textChannel.send(`:exclamation:  ${message}`)
  log(`Ошибка: ${message}`)
}