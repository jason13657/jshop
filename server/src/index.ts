import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import { connectDB } from "../db/database";
import { config } from "../config";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

connectDB()
  .then(() => {
    console.log("Database connected");
    const server = app.listen(config.host.port);
  })
  .catch(console.log);
