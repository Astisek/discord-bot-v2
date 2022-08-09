import EmptyCommand from "../../models/EmptyCommand";

export class Autoplay extends EmptyCommand {
  public execute = async () => {
    this.channel.autoPlay = !this.channel.autoPlay

    if (!this.channel.autoPlay) {
      this.channel.autoPlayPool = []
    }

    this.logger(`Autoplay ${this.channel.autoPlay ? "enabled" : "disabled"}`);
  };
}
