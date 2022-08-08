import { VoiceConnectionReadyState, VoiceConnectionStatus } from '@discordjs/voice';
import EmptyCommand from '../../models/EmptyCommand';

class Pause extends EmptyCommand {
  public execute = async () => {
    this.player?.pause()
    this.logger('Paused')
  };
}

export default Pause;
 