import mongoose from "mongoose";

class Mongo {
  constructor(private url: string) {
    this.connect()
  }

  private connect = () => {
    mongoose.connect(this.url, {dbName: 'discord'}, (err) => {
      if (err) return console.log(err);
      console.log(`Database connected!`);
    });
  };
}

export default Mongo
