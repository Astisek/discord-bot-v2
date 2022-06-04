import EmptyCommand from "../../models/EmptyCommand";
import { joinVoiceChannel } from "@discordjs/voice";

class Join extends EmptyCommand {
  public execute = async () => {
    await this.connectToVoice()
  };
}

export default Join;


