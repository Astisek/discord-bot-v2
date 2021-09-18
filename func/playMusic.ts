import { startMusic } from './startMusic';
import { IQueue } from './../consts';

export const playMusic = (serverQueue: IQueue) => {
  if (!serverQueue.playing && serverQueue.songs.length) startMusic(serverQueue);
} 