import { createEmbed } from './../func/createEmbed';
import Discord from 'discord.js'
import { log } from '../func/log';

export const help = (message: Discord.Message) => {
  const textchannel = message.channel

  const embed = createEmbed('Помощь', 'Основные команды:')
  embed.addFields([
    {name: '**join или j**', value: 'Подключение к голосовому каналу'},
    {name: '**leave или l**', value: 'Отключение от голосового канала'},
    {name: '**play или p**', value: `
    Воспроизводит видео с YouTube.
    Имеет 3 режима работы: 
    сыллка (https://www.youtube.com/watch?v=uFNZ6VbRhDI), 
    Сокращённая сыллка (https://youtu.be/0l4Z_Ob3kRE),
    Строка поиска (для отмены поиска надо отправить "c" или "cancel")
    `},
    {name: '**skip или s**', value: 'Пропускает текущий трек'},
    {name: '**pause**', value: 'Ставит воспроизведение на паузу'},
    {name: '**resume**', value: 'Продолжает воспроизведение'},
    {name: '**repeat**', value: 'Включает/Выключает режим повтора'},
    {name: '**queue или q**', value: 'Выводит текущий плейлист'},
    {name: '**move или m**', value: `
    Перемещает трек.
    Принимает 2 параметра, 
    Премещает трек из позиции первого параметра в позицию второго 
    (Позицию трека можно посмотреть в queue).
    `},
    {name: '**nowplaying**', value: 'Выводит информацию о текущем треке'},
    {name: '**seek**', value: `
    Перематывает трек на определённую позицию
    Имеет 2 режима работы: 
    seek 300 (Перематывает на 300 секунду),
    seek 20:30 (Перематывает на 20 минут 30 секунд).
    seek 3:30:20 !Работать не будет!
    `},
  ])

  textchannel.send(embed)
  log("Help")
}

