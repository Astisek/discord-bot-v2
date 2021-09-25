import Discord from 'discord.js';

export const nothingPlaying = (textChannel: Discord.TextChannel | Discord.DMChannel | Discord.NewsChannel) => 
  textChannel.send(':no_entry: Ничего не играет :ok: ')