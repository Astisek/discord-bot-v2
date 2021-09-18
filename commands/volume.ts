import { IQueue } from "../consts";
import { log } from "../func/log";

export const volume = (serverQueue: IQueue, args: string[]) => {
  const newVolume = +args[0]
  if (isNaN(newVolume)) 
    return serverQueue.textChannel.send(':no_entry: Неверное значение :face_with_hand_over_mouth:')

  serverQueue.dispatcher?.setVolume(newVolume)
  serverQueue.volume = newVolume

  log(`Volume установлен на ${newVolume}`)
  
  if (newVolume > 10) 
    serverQueue.textChannel.send(`:scarf: Volume установлен на ${newVolume} (pizda yham :scream_cat: )`)
  else 
    serverQueue.textChannel.send(`:scarf: Volume установлен на ${newVolume}`)
}