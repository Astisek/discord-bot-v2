import { leave } from './../commands/leave';
import { IQueue } from './../consts';

export const startAutoDisconnect = (serverQueue: IQueue)  => {
  // serverQueue.disconnectTimeOut = setTimeout(() => {
  //   leave(serverQueue)
  //   console.log('Auto disconnect');
  // }, 20 * 60 * 1000)
}