import { Message } from "discord.js";
import { client } from "..";
import Pause from "../actions/Pause";
import Resume from "../actions/Resume";
import Channel from "../models/Channel";

class BotMiddleware {
  private static eventSubscribers: string[] = []

  public static Pause = async (channelId: string) => {
    const channel = await this.getChannel(channelId)
    if (!channel) return
    const command = new Pause(channel, []);
    await command.execute()
  };
  public static Resume = async (channelId: string) => {
    const channel = await this.getChannel(channelId)
    if (!channel) return
    const command = new Resume(channel, []);
    await command.execute()
  };
  public static Queue = async (channelId: string) => {
    const channel = await this.getChannel(channelId)
    if (!channel) return
    return channel.songs
  };

  public static SubscribeOnEvent = (soketId: string) => {
    this.eventSubscribers.push(soketId)
  }
  public static UnSubscribeOnEvent = (soketId: string) => {
    this.eventSubscribers.filter(el => el !== soketId)
  }

  public static EmitEvent = (data)

  private static getChannel = async (channelId: string) => {
    return await Channel.findOne({ channelId });
  };
}
