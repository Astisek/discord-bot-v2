import { GuildRes } from "../interfaces/DiscordAPI";

export const validateChannelId = (userGuilds: GuildRes[], channelId: string) => userGuilds.find(el => el.id === channelId)