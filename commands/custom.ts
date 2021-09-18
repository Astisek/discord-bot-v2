import { sendAddSongEmbeded } from "./play";
import { playMusic } from "./../func/playMusic";
import { join } from "./join";
import Discord from "discord.js";
import { ImageEnum, IQueue, SongTypeEnum } from "./../consts";
import { log } from "../func/log";

export const custom = async (
  serverQueue: IQueue,
  message: Discord.Message,
  args: string[]
) => {
  const file = message.attachments.first();
  const customUrl = args[0];
  if (!file && !customUrl) {
    log(`Начало custom файл: не найден`)
    return serverQueue.textChannel.send(
      ":no_entry:Файл не найден :face_with_monocle: "
    );
  }
  await join(serverQueue, message);
  log(`Начало custom файл: ${file?.url || customUrl || "???"}`)
  const image =
    Math.random() < 0.01 ? ImageEnum.customTrackRandom : ImageEnum.customTrack;

  const song = {
    image,
    length: 0,
    title: file?.name || "Custom Url",
    url: file?.url || customUrl,
    type: SongTypeEnum.custom,
  };

  serverQueue.songs.push(song);
  sendAddSongEmbeded(
    serverQueue.textChannel,
    song.title,
    song.url,
    song.length,
    song.image
  );
  
  playMusic(serverQueue);
  log("Конец custom")
};
