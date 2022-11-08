import { MAX_SEARCH_POSITION } from "./../consts/app";
import { Message } from "discord.js";
import Play from "../actions/Play";
import { PREFIX } from "../consts/app";
import Channel from "../models/Channel";
import Search from "../models/Search";
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
      const voiceGuildId = this.message.member?.voice.channelId || "";
      if (channel) {
        channel.voiceChannel = voiceGuildId;
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
        voiceChannel: voiceGuildId,
        volume: 1,
      });
      await newChannel.save();
      return newChannel;
    }
  };

  private get isCommand() {
    return (
      this.message.deletable &&
      this.message.content.toLowerCase().startsWith(PREFIX)
    );
  }

  private checkSearchResults = async () => {
    const searchResult = await Search.findOne({
      author: this.message.member?.id,
    });
    const id = +this.message.content;

    if (searchResult) {
      if (this.message.content === "c" || this.message.content === "cancel") {
        searchResult.delete();
        this.message.delete();
        this.message.channel.messages.cache
          .find((el) => el.id === searchResult.messageId)
          ?.delete();
        return;
      }

      if (id <= MAX_SEARCH_POSITION && id >= 1) {
        const channel = await this.getChannel();
        const videoId = searchResult.results[id - 1];
        if (channel) {
          this.message.channel.messages.cache
            .find((el) => el.id === searchResult.messageId)
            ?.delete();
          
          await new Play(
            channel,
            [`https://www.youtube.com/watch?v=${videoId}`],
            this.message
          ).execute();

          searchResult.delete();
          channel.save();
        }
      }
    }
  };

  public checkMessage = async () => {
    if (this.checkAuthor) return;

    await this.checkSearchResults();

    if (this.isCommand) {
      const [command, ...args] = this.parseCommand();
      const channel = await this.getChannel();
      if (channel) {
        new ExecuteCommand(command, args, channel, this.message);
      }
    }
  };
}

export default ChannelInstance;
