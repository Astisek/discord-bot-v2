import { IChannel } from './Channel/model';
import { getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionReadyState } from '@discordjs/voice';
import { Guild, Message } from 'discord.js';
import { client } from '..';
import Notification from '../service/Notification';
import Discord from 'discord.js';

class EmptyCommand {
  protected guild?: Guild;
  protected voiceConnection?: VoiceConnection;

  constructor(protected channel: IChannel, protected args: string[], protected message: Message) {
    const guild = client.guilds.cache.get(channel.channelId);

    if (guild) {
      this.guild = guild;
      const id = this.guild.id;
      this.voiceConnection = getVoiceConnection(id);
    }
  }

  public execute = async () => {
    console.log('empty command');
  };
  protected sendMessage = (text: string | Discord.MessagePayload | Discord.MessageOptions) => {
    Notification.send(this.channel, text);
  };
  protected sendEmbed = async (
    title: string,
    desc?: string,
    callback?: (embed: Discord.MessageEmbed) => void,
    color?: [number, number, number],
  ) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(desc || '')
      .setColor(color || [226, 50, 50])
      .setAuthor({
        name: 'Сэр Гей',
        iconURL:
          'https://vignette.wikia.nocookie.net/baccano/images/9/90/E12_Ennis.png/revision/latest?cb=20170227231754',
      });
    if (callback) callback(embed);
    this.sendMessage({
      embeds: [embed],
    });
  };
  protected sendSecondaryEmbed = async (
    title: string,
    desc?: string,
    callback?: (embed: Discord.MessageEmbed) => void,
    color?: [number, number, number],
  ) => {
    this.sendEmbed(title, desc, (embed) => {
      embed.setColor(color || '#32b1e2');
      if (callback) callback(embed);
    });
  };
  protected onError = (e: any) => {
    this.sendMessage(e.message);
    console.log(e);
  }

  protected connectToVoice = async () => {
    if (this.guild) {
      try {
        this.voiceConnection = joinVoiceChannel({
          channelId: this.channel.voiceChannel,
          guildId: this.guild.id,
          adapterCreator: this.guild.voiceAdapterCreator,
        });
      } catch (e) {
        this.onError(e)
      }
    }
  };

  protected get player() {
    const state = this.voiceConnection?.state as VoiceConnectionReadyState
    return state.subscription?.player
  }
}

export default EmptyCommand;
