import { notConnected } from './../func/notConnected';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const repeat = async (serverQueue: IQueue) => {
  if (!serverQueue.connection) return notConnected(serverQueue.textChannel)
  serverQueue.repeat = !serverQueue.repeat
  const sendMessage = serverQueue.repeat ?
  ':leftwards_arrow_with_hook: Repeat on :notes: ' :
  ':leftwards_arrow_with_hook: Repeat off :flag_white: '

  log(`Repeat установлен на: ${serverQueue.repeat}`)
  serverQueue.textChannel.send(sendMessage)
}