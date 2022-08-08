import EmptyCommand from "../../models/EmptyCommand";

class Leave extends EmptyCommand {
  public execute = async () => { 
    this.voiceConnection?.destroy()
    this.logger('Leaved')
  }
}

export default Leave
