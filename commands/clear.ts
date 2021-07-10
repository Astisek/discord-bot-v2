import { createEmbed } from './../func/createEmbed';
import { IQueue } from './../consts';
import { send } from '../func/send';

export const clear = (serverQueue: IQueue) => {
  serverQueue.songs = [serverQueue.songs[0]]
  send(serverQueue, ":thumbsup: Плейлист отчищен")
}