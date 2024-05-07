import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import { connectDB } from "./db/database";
import { config } from "./config";
import * as trpcExpress from "@trpc/server/adapters/express";
import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/trpc";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createContext,
  })
);

connectDB()
  .then(() => {
    console.log("Database connected");
    const server = app.listen(config.host.port);
  })
  .catch(console.log);
