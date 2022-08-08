import Discord, {TextChannel} from "discord.js"
import {client} from ".."
import {IChannel} from "../models/Channel/model"


class Notification {
  static send = (channel: IChannel, message: string | Discord.MessagePayload | Discord.MessageOptions) => {
    const textChannel = client.channels.cache.get(channel.textChannel) as TextChannel
    return textChannel?.send(message)
  }
}

export default Notification
