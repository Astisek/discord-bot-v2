import { IQueue } from '../../consts';

export const send = (serverQueue: IQueue, message: string) => {
  serverQueue.textChannel.send(message)
}