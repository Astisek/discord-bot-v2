import { GuildRes, UserDataRes } from "./../interfaces/DiscordAPI";
import { SocketEvents } from "./../interfaces/SocketEvents";
import { Server } from "socket.io";
import { createServer } from "http";
import { logger } from "../service/logger";
import axios from "axios";
import { DiscordAPIEnum } from "./consts/DiscordAPIEnum";
import express from "express";
import http from "http";
import BotMiddleware from "../service/BotMiddleware";
import { validateChannelId } from "../helpers/validateServer";
import { SubscribeEnum } from "../interfaces/BotMiddleware";
import { BACKEND_PORT } from "../consts/app";
import { appRouter } from "./appController";
import cookieParser from "cookie-parser";

const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname + "/static/"));
app.use(cookieParser())
app.use('/api', appRouter)

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

export const bootstrapSocketServer = () => {
  io.on("connection", (soket) => {
    let userGuilds: GuildRes[];
    soket.on(SocketEvents.login, async ({ accessToken, tokenType }) => {
      const headers = {
        authorization: `${tokenType} ${accessToken}`,
      };

      const guilds = await axios.get<GuildRes[]>(DiscordAPIEnum.guilds, {
        headers,
      });
      const userData = await axios.get<UserDataRes>(DiscordAPIEnum.userData, {
        headers,
      });
      userGuilds = guilds.data;

      soket.emit(SocketEvents.login_client, {
        guilds,
        userData: userData.data,
      });
      BotMiddleware.SubscribeOnEvent(soket.id, userGuilds.map(el => el.id), SubscribeEnum.connectionStatus)
    });

    soket.on(SocketEvents.pause, async (channelId: string) => {
      if (!validateChannelId(userGuilds, channelId)) return;
      BotMiddleware.Pause(channelId);
    });
    soket.on(SocketEvents.resume, async (channelId: string) => {
      if (!validateChannelId(userGuilds, channelId)) return;
      BotMiddleware.Resume(channelId);
    });

    soket.on(SocketEvents.queue, async (channelId: string) => {
      if (!validateChannelId(userGuilds, channelId)) return;
      return BotMiddleware.Queue(channelId);
    });

  });

  server.listen(BACKEND_PORT, () => logger.info("Backend server started!"));
};
