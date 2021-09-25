import Discord from 'discord.js';
import ytdl from 'ytdl-core';
import { createEmbed } from '../../func/chatActions/createEmbed';
import { createError } from '../../func/chatActions/createError';
import { log } from '../../func/log';
import { IQueue, SongTypeEnum } from './../../consts';
import { startMusic } from '../../func/startMusic';
import { sendAddSongEmbeded } from '../../func/chatActions/addSong';
const searchYoutube = require("youtube-api-v3-search");



export const search = async (
  q: string,
  serverQueue: IQueue,
  message: Discord.Message
) => {
  log(`Поиск по youtube: ${q}`)
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
  } catch (e: any) {
    createError(serverQueue, e.message);
  }
};


export const searchSelect = async (
  id: string,
  serverQueue: IQueue,
  userId: string
) => {
  log(`Обработка id поиска: ${id}`)
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
    } catch (e: any) {
      createError(serverQueue, e.message);
    }
  } else serverQueue.textChannel.send(":cl:  Поиск отменён");

  serverQueue.finding.get(userId).message.delete();
  serverQueue.finding.delete(userId);
};