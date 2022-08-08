import EmptyCommand from '../../models/EmptyCommand';

class Resume extends EmptyCommand {
  public execute = async () => {
    this.player?.unpause()

    this.logger('Resumed')
  };
}

export default Resume;
 