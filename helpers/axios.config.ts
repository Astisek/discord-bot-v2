import axios from "axios";

export const discordApi = axios.create({
  baseURL: "https://discordapp.com/api/v6",
  
})