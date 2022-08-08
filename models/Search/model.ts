import { Document } from "mongoose";

export interface ISearch extends Document {
  author: string;
  results: string[];
  messageId: string;
} 