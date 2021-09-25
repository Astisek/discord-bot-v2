import { endPlaylist } from "./endPlaylist";
import { startAutoDisconnect } from "./autoDisconnect";
import ytdl from "discord-ytdl-core";
import { IQueue, ISong, SongTypeEnum } from "../consts";
import Discord from "discord.js";
import { log } from "./log";
import { getAutoplaySong } from "./getAutoplaySong";
import { sendAddSongEmbeded } from "./chatActions/addSong";

export const startMusic = async (serverQueue: IQueue, seekTImeSec?: number) => {
  // Установка состояния playing
  serverQueue.playing = true;

  // Определение типа потока
  const type: Discord.StreamType | undefined =
    serverQueue.songs[0].type === SongTypeEnum.youtube ? "opus" : undefined;

  // Создание диспатчера
  serverQueue.dispatcher = serverQueue.connection?.play(
    streamSelection(serverQueue.songs[0], seekTImeSec),
    { volume: serverQueue.volume, type }
  ) as Discord.StreamDispatcher;

  // Ивент при окончании воспроизведения
  serverQueue.dispatcher.on("finish", async () => {
    log(`Конец трека`);
    // Установка пропускания времени на 0
    serverQueue.skippedTime = 0;

    // Если включен autoPlay и последний трек, то добавить новый трек в плейлист
    if (
      serverQueue.autoPlay &&
      !serverQueue.repeat &&
      serverQueue.songs.length === 1
    ) {
      const nextTrack = await getAutoplaySong(serverQueue);
      if (nextTrack) {
        sendAddSongEmbeded(
          serverQueue.textChannel,
          nextTrack.title,
          nextTrack.url,
          nextTrack.length,
          nextTrack.image,
          true
        );
        serverQueue.songs.push(nextTrack);
      }
    }

    // Если включен repeat, то не удалять первый элемент массива
    if (!serverQueue.repeat) serverQueue.songs.shift();

    // Если ещё есть треки то рекурсия, а если нету завершение плейлиста
    if (serverQueue.songs.length !== 0) startMusic(serverQueue);
    else {
      endPlaylist(serverQueue);
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
