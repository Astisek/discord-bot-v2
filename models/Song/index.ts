import mongoose, { Schema } from "mongoose";
import {SchemasEnum} from "..";
import { ISong } from "./model";

const schema = new Schema<ISong>({
  image: { type: "String", required: true },
  length: { type: "Number", required: true },
  title: { type: "String", required: true },
  inputType: { type: "String", required: true },
  url: { type: "String", required: true },
});

const Song = mongoose.model<ISong>(SchemasEnum.SONG)
export default Song
