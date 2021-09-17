import { createError } from "./../func/createError";
import { fancyTimeFormat } from "./../func/fancyTime";
import { startMusic } from "./../func/startMusic";
import { join } from "./join";
import { IQueue, SongTypeEnum } from "../consts";
import Discord from "discord.js";
import ytdl from "discord-ytdl-core";
import { createEmbed } from "../func/createEmbed";
const searchYoutube = require("youtube-api-v3-search");

export const play = async (
  message: Discord.Message,
  args: string[],
  serverQueue: IQueue
) => {
  await join(serverQueue);
  if (!serverQueue.connection) return

  if (args[0].startsWith("https://www.youtube.com/"))
    await youtube(args[0], serverQueue);
  else if (args[0].startsWith("https://youtu.be/")) {
    const array = args[0].split("/");
    await youtube(
      `https://www.youtube.com/watch?v=${array[array.length - 1]}`,
      serverQueue
    );
  } else await search(args.join(" "), serverQueue, message);

  if (!serverQueue.playing && serverQueue.songs.length) startMusic(serverQueue);
};

const youtube = async (url: string, serverQueue: IQueue) => {
  try {
    const res = await ytdl.getInfo(url);
    const title = res.videoDetails.title;
    const length = +res.videoDetails.lengthSeconds;
    const image =
      res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url;

    serverQueue.songs.push({
      length,
      title,
      type: SongTypeEnum.youtube,
      url,
      image,
    });

    sendAddSongEmbeded(serverQueue.textChannel, title, url, length, image);
  } catch (e) {
    // @ts-ignore
    createError(serverQueue, e.message);
  }
};

const search = async (
  q: string,
  serverQueue: IQueue,
  message: Discord.Message
) => {
  var options = {
    q,
    part: "snippet",
    type: "video",
  };

  try {
    const res = await searchYoutube(process.env.YOUTUBE_V3_API_KEY, options);

    const exampleEmbed = createEmbed("Search", "Write your choice in the chat");

    for (let i = 0; i < res.items.length; i++) {
      exampleEmbed.addField(
        `${i + 1}: ${res.items[i].snippet.title}`,
        res.items[i].snippet.channelTitle
      );
    }
    exampleEmbed.setFooter('Чтобы отменить поиск введите: "c" или "cancel"');

    serverQueue.finding.set(message.author.id, {
      res,
      message: await serverQueue.textChannel.send(exampleEmbed),
    });
  } catch (e) {
    // @ts-ignore
    createError(serverQueue, e.message);
  }
};

export const searchSelect = async (
  id: string,
  serverQueue: IQueue,
  userId: string
) => {
  if (!(id === "cancel" || id === "c")) {
    const videoId =
      serverQueue.finding.get(userId).res.items[+id - 1].id.videoId;

    try {
      const url = `https://www.youtube.com/watch?v=${videoId}`;

      const res = await ytdl.getInfo(url);

      const title = res.videoDetails.title;
      const length = +res.videoDetails.lengthSeconds;
      const image =
        res.videoDetails.thumbnails[res.videoDetails.thumbnails.length - 1].url;

      serverQueue.songs.push({
        length,
        title,
        type: SongTypeEnum.youtube,
        url,
        image,
      });

      sendAddSongEmbeded(serverQueue.textChannel, title, url, length, image);

      if (!serverQueue.playing && serverQueue.songs.length)
        startMusic(serverQueue);
    } catch (e) {
      // @ts-ignore
      createError(serverQueue, e.message);
    }
  } else serverQueue.textChannel.send(":cl:  Поиск отменён");

  serverQueue.finding.get(userId).message.delete();
  serverQueue.finding.delete(userId);
};

const sendAddSongEmbeded = (
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
  title: string,
  url: string,
  length: number,
  image: string
) => {
  const exampleEmbed = createEmbed("Добавлено в очередь")
    .addField(title, url)
    .setImage(image)
    .setFooter(`Длительность: ${fancyTimeFormat(length)}`);

  textChannel.send(exampleEmbed);
};
