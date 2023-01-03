
export enum SubscribeEnum {
  connectionStatus = "connectionStatus"
}

export interface Subscribe {
  type: SubscribeEnum;
  channelIds: string[]
}