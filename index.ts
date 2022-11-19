import { bootstrapSocketServer } from './socketServer/index';
import { Client, Intents } from 'discord.js';
import { MONGO_URL, TOKEN } from './consts/app';
import ChannelInstance from './service/ChannelInstance';
import { logger } from './service/logger';
import Mongo from './service/Mongo';

bootstrapSocketServer()

export const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

new Mongo(MONGO_URL);

client.on('ready', () => {
  logger.info(`Logged in as ${client.user?.tag}!`);
});

client.on('multipleResolves', (_, __, reason) => {
  if (reason.toLocaleString() === 'Error: Cannot perform IP discovery - socket closed') return;
});

client.on('message', (message) => {
  const instance = new ChannelInstance(message);
  instance.checkMessage();
});

client.login(TOKEN);
