import Mongoose from "mongoose";
import { config } from "../../config";
import { Schema } from "mongoose";

export async function connectDB() {
  return Mongoose.connect(config.db.connect);
}
