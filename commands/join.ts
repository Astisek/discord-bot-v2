import { leave } from './leave';
import Discord from 'discord.js';
import { updateVoice } from './../consts';
import { notConnected } from '../func/chatActions/notConnected';
import { createError } from '../func/chatActions/createError';
import { startAutoDisconnect } from '../func/autoDisconnect';
import { IQueue } from '../consts';
import { log } from '../func/log';

export const join = async (serverQueue: IQueue, message: Discord.Message) => {
  log("Подключение к войсу")
  if (!serverQueue.voiceChannel) updateVoice(serverQueue, message)
  serverQueue.connection = await serverQueue.voiceChannel.join()
  serverQueue.connection.on('disconnect', () => {
    leave(serverQueue)
  })
  log("Подключён к войсу")
  startAutoDisconnect(serverQueue)
}