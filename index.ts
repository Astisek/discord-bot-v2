import { Client, Intents } from "discord.js";
import {MONGO_URL, TOKEN} from "./consts/app";
import ChannelInstance from "./service/ChannelInstance";
import Mongo from "./service/Mongo";

export const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
});

const mongo = new Mongo(MONGO_URL)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('message', (message) => {
  const instance = new ChannelInstance(message) 
  instance.checkMessage()
})

client.login(TOKEN)
