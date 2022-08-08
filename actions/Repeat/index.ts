import EmptyCommand from '../../models/EmptyCommand';

class Repeat extends EmptyCommand {
  public execute = async () => {
    this.channel.repeat = !this.channel.repeat

    this.logger(`Repeat set: ${this.channel.repeat}`)
  };
}

export default Repeat;
 