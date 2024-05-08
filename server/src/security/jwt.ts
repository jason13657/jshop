import jwt, { UserIDJwtPayload } from "jsonwebtoken";
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
};

export function createJwtToken(id: string) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
