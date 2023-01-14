import { SubscribeEnum } from '../../interfaces/BotMiddleware';
import EmptyCommand from '../../models/EmptyCommand';
import BotMiddleware from '../../service/BotMiddleware';

class Leave extends EmptyCommand {
  public execute = async () => {
    this.voiceConnection?.destroy();
    BotMiddleware.EmitEvent(SubscribeEnum.connectionStatus, this.channel.id, {
      connected: false,
    });
    this.logger('Leaved');
  };
}

export default Leave;
