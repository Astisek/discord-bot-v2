import { Request, Response } from 'express';
import { DiscordApi } from '../../helpers/DiscordApi';
import { CookieEnum } from '../types/Cookie';
import BotMiddleware from '../../service/BotMiddleware';

export const appController = {
  getList: async (req: Request, res: Response) => {
    try {
      const token = req.headers[CookieEnum.accessToken]?.toString();
      
      if (!token) throw new Error();
      DiscordApi.setToken(token);

      const list = await DiscordApi.guilds();
      const haveList = await BotMiddleware.HaveChannel(
        list.data.map((el) => el.id)
      );

      const filtredList = list.data.filter((el) =>
        haveList.find((item) => item.channelId === el.id)
      );

      res.json(filtredList);
    } catch (e) {
      console.log(e);
      return res.status(400).send();
    }
  },

  getMe: async (req: Request, res: Response) => {
    try {
      const token = req.headers[CookieEnum.accessToken]?.toString();
      if (!token) throw new Error();
      DiscordApi.setToken(token);

      const me = await DiscordApi.me();

      res.json(me);
    } catch (e) {
      console.log(e);
      return res.status(400).send();
    }
  },
};
