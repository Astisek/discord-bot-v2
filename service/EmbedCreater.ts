import Discord from "discord.js";
import { fancyTimeFormat } from "../helpers/fancyTime";

export class EmbedCreater {
  static default = (
    title: string,
    desc = "",
    callback?: (embed: Discord.MessageEmbed) => void,
    color?: [number, number, number]
  ) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(title)
      .setDescription(desc || "")
      .setColor(color || [226, 50, 50])
      .setAuthor({
        name: "Сэр Гей",
        iconURL:
          "https://vignette.wikia.nocookie.net/baccano/images/9/90/E12_Ennis.png/revision/latest?cb=20170227231754",
      });
    if (callback) callback(embed);
    return embed;
  };
  static addSongEmbed = (
    title: string,
    url: string,
    image: string,
    autoPlay: boolean,
    songLength: number,
    authorName?: string
  ) => {
    return EmbedCreater.default(
      `Добавлено в очередь ${autoPlay ? "(AutoPlay)" : ""}`,
      undefined,
      (embed) => {
        embed
          .addField(title, url)
          .setImage(image)
          .setFooter({
            text: `${
              authorName ? `Автор: ${authorName}` : ""
            }\nДлительность: ${fancyTimeFormat(songLength)}`,
          });
      },
      autoPlay ? [224, 152, 43] : undefined
    );
  };
}
