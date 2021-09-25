import { IQueue } from './../consts';
import { startAutoDisconnect } from './autoDisconnect';
import { log } from "./log";

export const endPlaylist = (serverQueue: IQueue) => {
  log(`Конец плейлиста`);
  serverQueue.playing = false;
  startAutoDisconnect(serverQueue);
}