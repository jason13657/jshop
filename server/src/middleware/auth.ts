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

  private validateToken = (req: Request): string | undefined => {
    let token;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      token = req.cookies["token"];
    }

    return token;
  };

  withAuth = async (req: Request, res: Response, next: NextFunction) => {
    const token = this.validateToken(req);

    if (!token) {
      return res.status(401).json({ message: "No token on request" });
    }

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
    const token = this.validateToken(req);

    if (!token) {
      return res.status(401).json({ message: "No token on request" });
    }

    try {
      const { id, admin } = await this.jwtHandler.verify(token);
      const user = await this.userRepository.findById(id);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.admin == undefined || user.admin == false) {
        return res.status(401).json({ message: "Request is not from admin" });
      }
      if (admin == undefined || admin == false) {
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
