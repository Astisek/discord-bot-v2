import { VoiceConnectionReadyState, VoiceConnectionStatus } from '@discordjs/voice';
import EmptyCommand from '../../models/EmptyCommand';

class Pause extends EmptyCommand {
  protected static command: string[] = ["pause"]

  public execute = async () => {
    this.player?.pause()
    this.logger('Paused')
  };
}

export default Pause;
 