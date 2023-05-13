import EmptyCommand from "../../models/EmptyCommand";
import { joinVoiceChannel } from "@discordjs/voice";
import BotMiddleware from "../../service/BotMiddleware";
import { SubscribeEnum } from "../../interfaces/BotMiddleware";

class Join extends EmptyCommand {
  protected static command: string[] = ["join", "j"]

  public execute = async () => {
    await this.connectToVoice()
    this.logger('Joined')
  };
}

export default Join;


