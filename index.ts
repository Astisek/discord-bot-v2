import { volume } from './commands/volume';
import { seek } from "./commands/seek";
import { move } from "./commands/move";
import { queue } from "./commands/queue";
import { repeat } from "./commands/repeat";
import { resume } from "./commands/resume";
import { pause } from "./commands/pause";
import { skip } from "./commands/skip";
import { play } from "./commands/play";
import { leave } from "./commands/leave";
import { join } from "./commands/join";
import { IQueue, serverQueueExample } from "./consts";
import dotenv from "dotenv";
import Discord from "discord.js";
import { nowPlaying } from "./commands/nowplaying";
import { help } from "./commands/help";
import { clear } from "./commands/clear";
import { test } from "./commands/test";
import { custom } from './commands/custom';
import { searchSelect } from './commands/play/search';
import { autoPlay } from './commands/autoplay';

dotenv.config();
const prefix = process.env.PREFIX || "s";

export const client = new Discord.Client();
const globalQueue = new Map<string, IQueue>();

client.on("ready", () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("message", async (message) => {
  // Автор не бот
  if (message.author.bot) return; // p, https://youtube.com/sdfdsfsdfsd

  // Парс команды
  const content = message.content.replace(prefix, "");
  const [command, ...args] = content.split(" ");

  // Поиск конфигурации бота в войсе, если нету создаёт новую
  if (!globalQueue.has(message.guild?.id || ""))
    globalQueue.set(
      message.guild?.id || "",
      serverQueueExample(message, globalQueue)
    );
  let serverQueue = globalQueue.get(message.guild?.id || "") as IQueue;

  // Проверяет в тот ли текстовый канал написана команда
  if (serverQueue.textChannel.id !== message.channel.id) return;

  // Если идёт поиск - обрабатывает ответ
  if (serverQueue.finding.has(message.author.id))
    searchSelect(message.content, serverQueue, message.author.id);

  // Проверка префикса
  if (!message.content.startsWith(prefix)) return;

  // Обработка команды
  switch (command.toLowerCase()) {
    case "join":
    case "j":
      join(serverQueue, message);
      break;

    case "leave":
    case "l":
      leave(serverQueue);
      break;

    case "play":
    case "p":
      play(message, args, serverQueue);
      break;

    case "skip":
    case "s":
      skip(serverQueue);
      break;

    case "pause":
      pause(serverQueue);
      break;

    case "resume":
      resume(serverQueue);
      break;

    case "repeat":
      repeat(serverQueue);
      break;

    case "queue":
    case "q":
      queue(serverQueue);
      break;

    case "move":
    case "m":
      move(message, args, serverQueue);
      break;

    case "nowplaying":
    case "np":
      nowPlaying(serverQueue);
      break;

    case "seek":
      seek(args, serverQueue);
      break;
    case "clear":
      clear(serverQueue);
      break;
    case "volume": 
      volume(serverQueue, args)
      break
    case "custom": 
    case "c": 
      custom(serverQueue, message, args)
      break
    case "autoplay": 
    case "ap": 
      autoPlay(serverQueue)
      break
    case "help":
      help(message);
      break;

    case "status":
      test(message, args, serverQueue);
      break;
  }
});

client.login(process.env.TOKEN);
