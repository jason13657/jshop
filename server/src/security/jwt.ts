import jwt, { UserIDJwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { config } from "../../config";
import { boolean } from "zod";

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    id: string;
    admin?: boolean;
  }
}
export interface JWTHandler {
  create: (value: string, admin?: boolean) => string;
  verify: (token: string) => Promise<jwt.UserIDJwtPayload>;
  secureToken: (res: Response, token: string) => void;
}

export const jwtHandler: JWTHandler = {
  create: (id: string, admin?: boolean) => {
    return jwt.sign({ id, admin }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
  },
  verify: (token: string) => {
    try {
      return Promise.resolve(<UserIDJwtPayload>jwt.verify(token, config.jwt.secretKey));
    } catch (error) {
      return Promise.reject("Faild to decode");
    }
  },
  secureToken: (res: Response, token: string) => {
    // the method to secure token for xss attack
    res.cookie("token", token, {
      maxAge: config.jwt.expiresInSec * 1000, // this is mil sec
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  },
};

export function createJwtToken(id: string) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
