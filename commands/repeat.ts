import { nothingPlaying } from './../func/nothingPlaying';
import { IQueue } from '../consts';

export const repeat = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)

  serverQueue.repeat = !serverQueue.repeat
  const sendMessage = serverQueue.repeat ?
  ':leftwards_arrow_with_hook: Repeat on :notes: ' :
  ':leftwards_arrow_with_hook: Repeat off :flag_white: '

  serverQueue.textChannel.send(sendMessage)
}