import EmptyCommand from "../../models/EmptyCommand";
import Notification from "../../service/Notification";

export class Autoplay extends EmptyCommand {
  public execute = async () => {
    this.channel.autoPlay = !this.channel.autoPlay

    if (!this.channel.autoPlay) {
      this.channel.autoPlayPool = []
    }

    this.sendMessage(`:closed_umbrella: Autoplay ${this.channel.autoPlay ? "включен" : "выключен"}`)

    this.logger(`Autoplay ${this.channel.autoPlay ? "enabled" : "disabled"}`);
  };
}
