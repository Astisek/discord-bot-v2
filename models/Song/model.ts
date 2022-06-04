export enum SongTypeEnum {
  youtube = "YOUTUBE",
  custom = "CUSTOM",
}

export type ISong = {
  inputType: SongTypeEnum;
  title: string;
  url: string;
  length: number;
  image: string;
};


