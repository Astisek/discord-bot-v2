import { Message } from "discord.js";
import { client } from "..";
import Pause from "../actions/Pause";
import Resume from "../actions/Resume";
import { Subscribe, SubscribeEnum } from "../interfaces/BotMiddleware";
import Channel from "../models/Channel";
import { io } from "../socketServer";

class BotMiddleware {
  // Data
  private static eventSubscribers = new Map<string, Subscribe>();

  // Endponts
  public static Pause = async (channelId: string) => {
    const channel = await this.getChannel(channelId);
    if (!channel) return;
    const command = new Pause(channel, []);
    await command.execute();
  };
  public static Resume = async (channelId: string) => {
    const channel = await this.getChannel(channelId);
    if (!channel) return;
    const command = new Resume(channel, []);
    await command.execute();
  };
  public static Queue = async (channelId: string) => {
    const channel = await this.getChannel(channelId);
    if (!channel) return;
    return channel.songs;
  };

  public static SubscribeOnEvent = (
    soketId: string,
    channelIds: string[],
    type: SubscribeEnum
  ) => {
    this.eventSubscribers.set(soketId, {
      type,
      channelIds,
    });
    // EmitData for front
  };
  public static UnSubscribeOnEvent = (soketId: string) => {
    this.eventSubscribers.delete(soketId);
  };

  public static EmitEvent = (
    type: SubscribeEnum,
    channelId: string,
    data: any
  ) => {
    this.eventSubscribers.forEach((el, id) => {
      if (el.channelIds.find((chId) => chId === channelId)) {
        io.to(id).emit(type, {
          channelId,
          ...data,
        });
      }
    });
  };

  public static HaveChannel = async (channelIds: string[]) => {
    try {
      return await Channel.find({ channelId: { $in: channelIds } })
    } catch (e) {
      return []
    }
  }

  // Private
  private static getChannel = async (channelId: string) => {
    return await Channel.findOne({ channelId });
  };
}

export default BotMiddleware;
