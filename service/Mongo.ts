import mongoose from "mongoose";
import { logger } from "./logger";

class Mongo {
  constructor(private url: string) {
    this.connect()
  }

  private connect = () => {
    mongoose.connect(this.url, {dbName: 'discord'}, (err) => {
      if (err) return console.log(err);
      logger.info(`Database connected!`)
    });
  };
}

export default Mongo
