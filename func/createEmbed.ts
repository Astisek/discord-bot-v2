import Discord from 'discord.js';

export const createEmbed = (title: string, desc: string) => new Discord.MessageEmbed()
  .setTitle(title)
  .setDescription(desc)
  .setColor('#e23232')
  .setAuthor('Сэр Гей', 'https://vignette.wikia.nocookie.net/baccano/images/9/90/E12_Ennis.png/revision/latest?cb=20170227231754')
  // Search Write your choice in the chat