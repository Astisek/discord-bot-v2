import { nothingPlaying } from './../func/nothingPlaying';
import { IQueue } from '../consts';

export const resume = async (serverQueue: IQueue) => {
  if (!serverQueue.playing) return nothingPlaying(serverQueue.textChannel)
		
	serverQueue.dispatcher?.resume()
	serverQueue.textChannel.send("Resumed :point_right_tone5: :ok_hand_tone5: ")
}