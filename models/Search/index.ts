import { SchemasEnum } from '..';
import mongoose, { Schema } from "mongoose";
import { ISearch } from "./model";

const schema = new Schema<ISearch>({
  author: { type: "String", required: true },
  results: [{ type: "String", required: true }],
  messageId: { type: "String", required: true },
})

const Search = mongoose.model<ISearch>(SchemasEnum.SEARCH, schema)

export default Search