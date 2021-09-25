import { nothingPlaying } from '../func/chatActions/nothingPlaying';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const resume = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
	
	log('Воспроизведение')

	serverQueue.dispatcher?.resume()
	serverQueue.textChannel.send("Resumed :point_right_tone5: :ok_hand_tone5: ")
}