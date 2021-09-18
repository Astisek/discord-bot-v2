import { createEmbed } from './../func/createEmbed';
import { IQueue } from './../consts';
import { send } from '../func/send';
import { log } from '../func/log';

export const clear = (serverQueue: IQueue) => {
  log("Отчистка плейлиста")
  serverQueue.songs = [serverQueue.songs[0]]
  send(serverQueue, ":thumbsup: Плейлист отчищен")
  log("Плейлист отчищен")
}