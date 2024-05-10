import { NextFunction, Request, Response } from "express";
import { encryptor } from "../security/encryptor";
import { config } from "../../config";

export async function validateCSRF(req: Request, res: Response, next: NextFunction) {
  if (!(req.method === "POST" || req.method === "PUT" || req.method === "PATCH" || req.method === "DELETE")) {
    return next();
  }

  const reqToken = req.get("jshop-token");
  if (!reqToken) {
    return res.status(403).json({ message: "No CSRF token on header" });
  }

  const validate = await encryptor.compare(config.security.csrfToken, reqToken);

  if (!validate) {
    return res.status(403).json({ message: "Invalid csrf token" });
  } else {
    next();
  }
}
