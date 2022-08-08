import EmptyCommand from '../../models/EmptyCommand';

class Volume extends EmptyCommand {
  public execute = async () => {
    const newVolume = +this.args[0]
    if (isNaN(newVolume) || newVolume > 1000) {
      this.sendMessage(':no_entry: Неверное значение :face_with_hand_over_mouth:')
      return
    }
    
    this.playerState?.resource?.volume?.setVolume(newVolume)
    this.channel.volume = newVolume
  
    if (newVolume > 10) 
      this.sendMessage(`:scarf: Volume установлен на ${newVolume} (pizda yham :scream_cat: )`)
    else 
      this.sendMessage(`:scarf: Volume установлен на ${newVolume}`)
    this.logger(`Volume set to ${newVolume}`)
  };
}

export default Volume;
