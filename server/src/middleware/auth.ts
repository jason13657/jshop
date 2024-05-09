import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repository/user";
import { JWTHandler } from "../security/jwt";

export default class AuthMiddleware {
  userRepository: UserRepository;
  jwtHandler: JWTHandler;
  constructor(userRepository: UserRepository, jwtHandler: JWTHandler) {
    this.userRepository = userRepository;
    this.jwtHandler = jwtHandler;
  }

  withAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!(authHeader && authHeader.startsWith("Bearer "))) {
      return res.status(401).json({ message: "No Bearer on header" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const { id } = await this.jwtHandler.verify(token);
      const user = await this.userRepository.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.userId = user.id;
      req.token = token;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid jwt token" });
    }
  };

  withAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!(authHeader && authHeader.startsWith("Bearer "))) {
      return res.status(401).json({ message: "No Bearer on header" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const { id, admin } = await this.jwtHandler.verify(token);
      const user = await this.userRepository.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      if (user.admin == undefined || user.admin !== true) {
        return res.status(401).json({ message: "Request is not from admin" });
      }
      if (admin == undefined || admin !== true) {
        return res.status(401).json({ message: "Request is not from admin" });
      }
      req.userId = user.id;
      req.token = token;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid jwt token" });
    }
  };
}
