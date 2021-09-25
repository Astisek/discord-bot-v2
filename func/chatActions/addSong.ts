import Discord from "discord.js";
import { createEmbed } from "./createEmbed";
import { fancyTimeFormat } from "../fancyTime";

export const sendAddSongEmbeded = (
  textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel,
  title: string,
  url: string,
  length: number,
  image: string,
  autoPlay?: boolean
) => {
  const exampleEmbed = createEmbed(
    `Добавлено в очередь ${autoPlay ? "(AutoPlay)" : ""}`,
    undefined,
    autoPlay ? "#e0982b" : ""
  )
    .addField(title, url)
    .setImage(image)
    .setFooter(`Длительность: ${fancyTimeFormat(length)}`);

  textChannel.send(exampleEmbed);
};
