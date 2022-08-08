import dotenv from "dotenv";

dotenv.config();

export const PREFIX = process.env.PREFIX || "s";
export const TOKEN = process.env.TOKEN || ''
export const MONGO_URL = process.env.MONGO_CONNECT || ''
export const YOUTUBE_API = process.env.YOUTUBE_V3_API_KEY || ''
export const MAX_SEARCH_POSITION = 10