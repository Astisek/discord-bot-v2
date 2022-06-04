import EmptyCommand from "../../models/EmptyCommand";

class Leave extends EmptyCommand {
  public execute = async () => { 
    this.voiceConnection?.destroy()
  }
}

export default Leave
