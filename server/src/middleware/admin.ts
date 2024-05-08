import { NextFunction, Request, Response } from "express";
import { jwtHandler } from "../security/jwt";
import { userRepository } from "../repository/user";

export async function withAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.get("Authorization");
  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    return res.status(401).json({ message: "No bearer request" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { id, admin } = jwtHandler.verify(token);
    const user = await userRepository.findById(id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (!admin) {
      return res.status(401).json({ message: "Request is not from admin" });
    }
    req.userId = user.id;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid jwt token" });
  }
}
