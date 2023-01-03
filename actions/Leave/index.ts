import { SubscribeEnum } from "../../interfaces/BotMiddleware";
import EmptyCommand from "../../models/EmptyCommand";
import BotMiddleware from "../../service/BotMiddleware";

class Leave extends EmptyCommand {
  public execute = async () => { 
    this.voiceConnection?.destroy()
    // BotMiddleware.EmitEvent(SubscribeEnum.connectionStatus, {
    //   channelId: this.channel.id,
    //   connected: true
    // })
    this.logger('Leaved')
  }
}

export default Leave
