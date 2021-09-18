import Discord from 'discord.js';
import { updateVoice } from './../consts';
import { notConnected } from './../func/notConnected';
import { createError } from './../func/createError';
import { startAutoDisconnect } from '../func/autoDisconnect';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const join = async (serverQueue: IQueue, message: Discord.Message) => {
  log("Подключение к войсу")
  if (!serverQueue.voiceChannel) updateVoice(serverQueue, message)
  serverQueue.connection = await serverQueue.voiceChannel.join()
  log("Подключён к войсу")
  startAutoDisconnect(serverQueue)
}