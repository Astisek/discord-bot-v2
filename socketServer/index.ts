import { GuildRes, UserDataRes } from './../interfaces/DiscordAPI';
import { SocketEvents } from "./../interfaces/SocketEvents";
import { Server } from "socket.io";
import { createServer } from "http";
import { logger } from "../service/logger";
import axios from "axios";
import { DiscordAPIEnum } from "./consts/DiscordAPIEnum";
import express from "express";
import http from "http";

export const bootstrapSocketServer = () => {
  const app = express();
  const server = http.createServer(app);

  app.use(express.static(__dirname + "/static/"));

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (soket) => {
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
      soket.emit(SocketEvents.login_client, {
        guilds: guilds.data,
        userData: userData.data,
      });
    });

    soket.on(SocketEvents.pause, async () => {
      
    })
  });

  server.listen(3000, () => logger.info("Backend server started!"));
};
