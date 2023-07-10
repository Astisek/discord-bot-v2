import { GuildRes, UserDataRes } from "../interfaces/DiscordAPI";
import { discordApi } from "./axios.config";

export class DiscordApi {
  private static token: string;

  private static getHeaders = () => ({
    Authorization: `Bearer ${DiscordApi.token}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  });

  public static setToken = (token: string) => {
    DiscordApi.token = token;
  };

  public static me = async () => {
    return discordApi.get<UserDataRes>('/users/@me', {
      headers: this.getHeaders(),
    });
  };

  public static guilds = async () => {
    return discordApi.get<GuildRes[]>('/users/@me/guilds', {
      headers: this.getHeaders(),
    });
  };
}
