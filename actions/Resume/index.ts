import EmptyCommand from '../../models/EmptyCommand';

class Resume extends EmptyCommand {
  protected static command: string[] = ["resume"]

  public execute = async () => {
    this.player?.unpause()

    this.logger('Resumed')
  };
}

export default Resume;
 