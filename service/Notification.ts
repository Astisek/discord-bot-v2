import Discord, { MessageEmbed, TextChannel } from 'discord.js';
import { client } from '..';
import { IChannel } from '../models/Channel/model';

class Notification {
  static send = (
    channel: IChannel,
    message?: string | Discord.MessagePayload | Discord.MessageOptions,
    embed?: MessageEmbed,
  ) => {
    const textChannel = client.channels.cache.get(channel.textChannel) as TextChannel;
    if (message) return textChannel?.send(message);
    if (embed)
      return textChannel?.send({
        embeds: [embed],
      });
  };
}

export default Notification;
