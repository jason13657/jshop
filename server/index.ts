import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/db/database";
import { config } from "./config";
import { authRouter } from "./src/router/auth";
import AuthController from "./src/controller/auth";
import { userRepository } from "./src/repository/user";
import { jwtHandler } from "./src/security/jwt";
import { encryptor } from "./src/security/encryptor";
import { validateCSRF } from "./src/middleware/csrf";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("tiny"));

// router
app.use(validateCSRF);
app.use("/auth", authRouter(new AuthController(userRepository, jwtHandler, encryptor, config.security.csrfToken)));

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});

connectDB()
  .then(() => {
    console.log("Database connected");
    const server = app.listen(config.host.port);
  })
  .catch(console.log);
