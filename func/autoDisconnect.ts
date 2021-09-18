import { leave } from '../commands/leave';
import { IQueue } from '../consts';
import { log } from './log';

export const startAutoDisconnect = (serverQueue: IQueue)  => {
  log(`Установлен auto disconnect`)
  serverQueue.disconnectTimeOut = setTimeout(() => {
    leave(serverQueue)
    log('Auto disconnected')
  }, 20 * 60 * 1000)
}

export const endAutoDisconnect = (serverQueue: IQueue) => {
  log('Auto disconnect остановлен')
  clearTimeout(serverQueue.disconnectTimeOut as NodeJS.Timeout)
}