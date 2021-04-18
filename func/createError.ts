import { IQueue } from './../consts';

export const createError = (serverQueue: IQueue, message: any) => 
  serverQueue.textChannel.send(`:exclamation:  ${message}`)