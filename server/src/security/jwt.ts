import jwt, { UserIDJwtPayload } from "jsonwebtoken";
import { config } from "../../config";

declare module "jsonwebtoken" {
  export interface UserIDJwtPayload extends jwt.JwtPayload {
    id: string;
  }
}
export interface JWTHandler {
  create: (value: string) => string;
  verify: (token: string) => jwt.UserIDJwtPayload;
}

export const jwtHandler: JWTHandler = {
  create: (id: string) => {
    return jwt.sign({ id }, config.jwt.secretKey, { expiresIn: config.jwt.expiresInSec });
  },
  verify: (token: string) => {
    return <UserIDJwtPayload>jwt.verify(token, config.jwt.secretKey);
  },
};

export function createJwtToken(id: string) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
