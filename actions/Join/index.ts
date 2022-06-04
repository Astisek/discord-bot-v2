import EmptyCommand from "../../models/EmptyCommand";
import { joinVoiceChannel } from "@discordjs/voice";

class Join extends EmptyCommand {
  public execute = async () => {
    if (this.guild) {
      try {
        joinVoiceChannel({
          channelId: this.channel.voiceChannel,
          guildId: this.guild.id,
          adapterCreator: this.guild.voiceAdapterCreator,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
}

export default Join;
