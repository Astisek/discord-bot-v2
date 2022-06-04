import dotenv from "dotenv";

dotenv.config();

export const PREFIX = process.env.PREFIX || "s";
export const TOKEN = process.env.TOKEN || ''
export const MONGO_URL = process.env.MONGO_CONNECT || ''

