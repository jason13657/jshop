import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import cookieParser from "cookie-parser";
import { connectDB, deconnectDB } from "./src/db/database";
import { config } from "./config";
import { authRouter } from "./src/router/auth";
import AuthController from "./src/controller/auth";
import { userRepository } from "./src/repository/user";
import { jwtHandler } from "./src/security/jwt";
import { encryptor } from "./src/security/encryptor";
import { validateCSRF } from "./src/middleware/csrf";
import { authValidate } from "./src/middleware/validate/auth";
import { productRouter } from "./src/router/product";
import { productValidate } from "./src/middleware/validate/product";
import ProductController from "./src/controller/product";
import { productRepository } from "./src/repository/product";
import AuthMiddleware from "./src/middleware/auth";

const app = express();

export async function startServer(port?: number) {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan("tiny"));

  //controller
  const authController = new AuthController(userRepository, jwtHandler, encryptor, config.security.csrfToken);
  const productController = new ProductController(productRepository);

  //middleware
  const authMiddleware = new AuthMiddleware(userRepository, jwtHandler);

  // router
  app.use(validateCSRF);
  app.use("/auth", authRouter(authValidate, authController));
  app.use("/product", productRouter(productValidate, productController, authMiddleware));

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.sendStatus(500);
  });

  await connectDB();
  console.log("Database connected");

  const server = app.listen(port);



  return server;
}

export type Server = Awaited<ReturnType<typeof startServer>>;

export async function stopServer(server: Server) {
  return new Promise<void>((resolve, reject) => {
    server.close(async () => {
      try {
        await deconnectDB();
        resolve();
      } catch (error) {
        reject();
      }
    });
  });
}

startServer(config.host.port);
