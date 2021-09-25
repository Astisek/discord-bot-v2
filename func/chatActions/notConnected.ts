import Discord from 'discord.js';

export const notConnected = (textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) => 
  textChannel.send(':no_entry: Не подключен к каналу :disappointed: ')