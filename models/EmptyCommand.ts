import { IChannel } from './Channel/model';
import { AudioPlayerPlayingState, getVoiceConnection, joinVoiceChannel, VoiceConnection, VoiceConnectionReadyState, VoiceConnectionStatus } from '@discordjs/voice';
import { Guild, Message } from 'discord.js';
import { client } from '..';
import Notification from '../service/Notification';
import Discord from 'discord.js';
import { ICommandPostActions } from '.';
import MusicPlayer from '../service/MusicPlayer';
import { logger } from '../service/logger';
import BotMiddleware from '../service/BotMiddleware';
import { SubscribeEnum } from '../interfaces/BotMiddleware';

class EmptyCommand {
  protected static command: string[] = []

  protected guild?: Guild;
  protected voiceConnection?: VoiceConnection;

  constructor(protected channel: IChannel, protected args: string[], protected message?: Message) {
    const guild = client.guilds.cache.get(channel.channelId);

    if (guild) {
      this.guild = guild;
      const id = this.guild.id;
      this.voiceConnection = getVoiceConnection(id);
    }
  }
  public static getCommands() {
    return this.command
  } 

  public execute = async (): Promise<ICommandPostActions | void> => {
    console.log('empty command');
  };
  protected sendMessage = (text: string | Discord.MessagePayload | Discord.MessageOptions) => {
    return Notification.send(this.channel, text);
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
    return this.sendMessage({
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
        // Connect
        this.voiceConnection = joinVoiceChannel({
          channelId: this.channel.voiceChannel,
          guildId: this.guild.id,
          adapterCreator: this.guild.voiceAdapterCreator,
        });

        // Emit event
        BotMiddleware.EmitEvent(SubscribeEnum.connectionStatus, this.channel.id, {
          connected: true
        })

        // Ondisconnect event
        this.voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
          BotMiddleware.EmitEvent(SubscribeEnum.connectionStatus, this.channel.id, {
            connected: false
          })
        })
      } catch (e) {
        this.onError(e)
      }
    }
  };

  protected get player() {
    const state = this.voiceConnection?.state as VoiceConnectionReadyState | undefined
    return state?.subscription?.player
  }
  protected unsubscribePlayer = () => {
    const state = this.voiceConnection?.state as VoiceConnectionReadyState | undefined
    state?.subscription?.unsubscribe()
  }
  protected get playerState() {
    return this.player?.state as Partial<AudioPlayerPlayingState> | undefined 
  }
  protected async startPlayerIfNeed() {
    if (!this.player && this.channel.songs.length >= 1) {
      this.logger(`StartPlayerIfNeed true`)
      const player = new MusicPlayer(this.channel, this.voiceConnection, this.player);
      await player.start();
    }
    else {
      this.logger(`StartPlayerIfNeed false ${!!this.player} ${this.channel.songs.length}`)
    }
  }
  protected logger(text: string) {
    logger.debug(`${this.channel.id}: ${text}`)
  }
}

export default EmptyCommand;
