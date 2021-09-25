import { notConnected } from "../func/chatActions/notConnected";
import { log } from "../func/log";
import { IQueue } from "./../consts";

export const autoPlay = (serverQueue: IQueue) => {
  if (!serverQueue.connection) return notConnected(serverQueue.textChannel);
  serverQueue.autoPlay = !serverQueue.autoPlay;
  const sendMessage = serverQueue.autoPlay
    ? ":closed_umbrella: Autoplay включён "
    : ":closed_umbrella: Autoplay выключен ";

  log(`Autoplay установлен на: ${serverQueue.autoPlay}`);
  serverQueue.textChannel.send(sendMessage);
};
