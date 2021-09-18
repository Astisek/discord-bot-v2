import { nothingPlaying } from './../func/nothingPlaying';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const pause = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
	log('Пауза')
		
	serverQueue.dispatcher?.pause()
	serverQueue.textChannel.send("Paused :point_right_tone5: :ok_hand_tone5: ")
}