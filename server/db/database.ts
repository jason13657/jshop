import Mongoose from "mongoose";
import { config } from "../config";

export async function connectDB() {
  return Mongoose.connect(config.db.connect);
}
