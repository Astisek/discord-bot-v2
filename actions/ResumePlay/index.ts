import EmptyCommand from '../../models/EmptyCommand';

class ResumePlay extends EmptyCommand {
  protected static command: string[] = ["resumeplay", "rp"]
  public execute = async () => {
    await this.connectToVoice();
    this.logger(`Resume play with: ${this.channel.songs.length} songs`)
    this.startPlayerIfNeed();
  };
}

export default ResumePlay;
