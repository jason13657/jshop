import { NextFunction, Request, Response } from "express";
import { encryptor } from "../security/encryptor";

export async function validateCSRF(req: Request, res: Response, next: NextFunction, csrfToken: string) {
  if (!(req.method === "POST" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")) {
    return next();
  }

  const reqToken = req.get("jshop-token");
  if (!reqToken) {
    return res.status(403).json("No CSRF token on header");
  }

  const validate = await encryptor.compare(reqToken, csrfToken);
}
