import { Message } from "discord.js";
import { PREFIX } from "../consts/app";
import Channel from "../models/Channel";
import ExecuteCommand from "./SelectCommand";

class ChannelInstance {
  constructor(private message: Message) {}

  private get checkAuthor() {
    return this.message.author.bot;
  }
  private get guildId() {
    return this.message.guildId;
  }

  private parseCommand = () => {
    const content = this.message.content.replace(PREFIX, "");
    return content.split(" ");
  };
  private getChannel = async () => {
    if (this.guildId) {
      const channel = await Channel.findOne({ channelId: this.guildId });
      if (channel) {
        channel.voiceChannel = this.message.member?.voice.channelId || "";
        channel.textChannel = this.message.channelId;
        await channel.save();
        return channel;
      }

      const newChannel = new Channel({
        channelId: this.guildId,
        autoPlay: false,
        playing: false,
        repeat: false,
        skippedTime: 0,
        songs: [],
        textChannel: this.message.channelId,
        voiceChannel: this.message.member?.voice.channelId || "",
        volume: 1,
      });
      await newChannel.save();
      return newChannel;
    }
  };

  public checkMessage = async () => {
    if (this.checkAuthor) return;

    const [command, ...args] = this.parseCommand();
    const channel = await this.getChannel();
    if (channel) {
      new ExecuteCommand(command, args, channel);
    }
  };
}

export default ChannelInstance;
