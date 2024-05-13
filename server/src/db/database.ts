import Mongoose from "mongoose";
import { config } from "../../config";
import { Schema } from "mongoose";

export async function connectDB() {
  return Mongoose.connect(config.db.connect);
}

export async function deconnectDB() {
  return Mongoose.connection.close();
}

export async function dropCollection(collection: string) {
  return Mongoose.connection.dropCollection(collection);
}
