import EmptyCommand from '../../models/EmptyCommand';

class Repeat extends EmptyCommand {
  public execute = async () => {
    this.channel.repeat = !this.channel.repeat
    this.channel.save()
  };
}

export default Repeat;
 