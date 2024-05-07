import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import jwt, { VerifyErrors, decode } from "jsonwebtoken";
import { config } from "../config";
import * as UserRespository from "../repository/user";

export async function getAuth({ req, res }: CreateExpressContextOptions) {
  const header = req.get("Authorization");

  if (!(header && header.startsWith("Bearer "))) {
    return res.status(401).json("Authentication Error - Invalid request");
  }

  const token = header.split(" ")[1];
  jwt.verify(
    token,
    config.jwt.secretKey,
    async (error: VerifyErrors | null, decoded: any) => {
      if (error) {
        return res.status(401).json("Authentication Error - Invalid token");
      }
      const user = await UserRespository.findById(decoded.id);
      if (!user) {
        return res.status(401).json("Authentication Error - No user found");
      }
      return user;
    }
  );
}
