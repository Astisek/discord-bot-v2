import EmptyCommand from '../../models/EmptyCommand';

class Repeat extends EmptyCommand {
  protected static command: string[] = ["repeat"]

  public execute = async () => {
    this.channel.repeat = !this.channel.repeat

    this.logger(`Repeat set: ${this.channel.repeat}`)
  };
}

export default Repeat;
 