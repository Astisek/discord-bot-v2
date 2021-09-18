import { startAutoDisconnect } from "./autoDisconnect";
import ytdl from "discord-ytdl-core";
import { IQueue, ISong, SongTypeEnum } from "../consts";
import Discord from "discord.js";
import { log } from "./log";

export const startMusic = async (serverQueue: IQueue, seekTImeSec?: number) => {
  serverQueue.playing = true;
  const type = serverQueue.songs[0].type === SongTypeEnum.youtube ? "opus" : undefined

  serverQueue.dispatcher = await serverQueue.connection?.play(
    streamSelection(serverQueue.songs[0], seekTImeSec),
    { volume: serverQueue.volume, type }
  ) as Discord.StreamDispatcher;

  serverQueue.dispatcher.on("finish", () => {
    serverQueue.skippedTime = 0;
    if (!serverQueue.repeat) serverQueue.songs.shift();
    log(`Конец трека`)
    if (serverQueue.songs.length != 0) startMusic(serverQueue);
    else {
      log(`Конец плейлиста`)
      serverQueue.playing = false;
      startAutoDisconnect(serverQueue);
    }
  });
};

const streamSelection = (song: ISong, seek?: number) => {
  switch (song.type) {
    case SongTypeEnum.youtube:
      return (
        ytdl(song.url, {
          filter: "audioonly",
          opusEncoded: true,
          seek,
          encoderArgs: ["-af", "bass=g=10,dynaudnorm=f=200"],
        }) || ""
      );
    case SongTypeEnum.custom:
      return song.url;
    default:
      return song.url;
  }
};
