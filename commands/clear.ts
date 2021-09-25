import { createEmbed } from '../func/chatActions/createEmbed';
import { IQueue } from './../consts';
import { send } from '../func/chatActions/send';
import { log } from '../func/log';

export const clear = (serverQueue: IQueue) => {
  log("Отчистка плейлиста")
  serverQueue.songs = [serverQueue.songs[0]]
  send(serverQueue, ":thumbsup: Плейлист отчищен")
  log("Плейлист отчищен")
}