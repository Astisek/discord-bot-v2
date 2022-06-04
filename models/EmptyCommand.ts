import { getVoiceConnection, VoiceConnection } from "@discordjs/voice";
import { Guild } from "discord.js";
import { client } from "..";
import Notification from "../service/Notification";
import {IChannelModel} from "./Channel/model";
import Discord from 'discord.js';

class EmptyCommand {
  protected guild?: Guild;
  protected voiceConnection?: VoiceConnection;

  constructor(protected channel: IChannelModel, protected args: string[]) {
    const guild = client.guilds.cache.get(channel.channelId);
    if (guild) {
      this.guild = guild;
      this.voiceConnection = getVoiceConnection(guild.id);
    }
  }

  public execute = async () => {
    console.log("empty command");
  };
  protected sendMessage = (text: string | Discord.MessagePayload | Discord.MessageOptions) => {
    Notification.send(this.channel, text);
  };
  protected sendEmbed = async (title: string, desc?: string, callback?: (embed: Discord.MessageEmbed) => void, color?: [number, number, number]) => {
    const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(desc || '')
        .setColor(color || [226, 50, 50])
        .setAuthor({
          name: 'Сэр Гей',
          iconURL: 'https://vignette.wikia.nocookie.net/baccano/images/9/90/E12_Ennis.png/revision/latest?cb=20170227231754'
        })
    if (callback) callback(embed)
    this.sendMessage({
      embeds: [embed]
    })
  }
}

export default EmptyCommand;
