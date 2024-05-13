import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repository/user";
import { JWTHandler } from "../security/jwt";
import { Encryptor } from "../security/encryptor";

export default class AuthController {
  private userRepository: UserRepository;
  private encryptor: Encryptor;
  private jwt: JWTHandler;
  private csrfToken: string;

  constructor(userRepository: UserRepository, jwtHandler: JWTHandler, encryptor: Encryptor, csrfToken: string) {
    this.userRepository = userRepository;
    this.encryptor = encryptor;
    this.jwt = jwtHandler;
    this.csrfToken = csrfToken;
  }

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await this.userRepository.findByUsername(username);

    if (user === null) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const isPasswordValid = await this.encryptor.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = this.jwt.create(user.id, user.admin);
    this.jwt.secureToken(res, token);
    res.status(201).json({ token, username, admin: user.admin ?? false });
  };

  signUp = async (req: Request, res: Response) => {
    const { username, password, email, name, admin } = req.body;

    const usernameCheck = await this.userRepository.findByUsername(username);
    if (usernameCheck) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const emailCheck = await this.userRepository.findByEmail(email);
    if (emailCheck) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashed = await this.encryptor.hash(password);

    const userId = await this.userRepository.create({
      username,
      name,
      password: hashed,
      email,
      admin,
    });

    const token = this.jwt.create(userId, admin);
    this.jwt.secureToken(res, token);
    res.status(201).json({ token, username, admin });
  };

  signOut = (req: Request, res: Response) => {
    res.cookie("token", "");
    res.status(200).json({ message: "Sign out" });
  };

  me = async (req: Request, res: Response) => {
    let token;
    const authHeader = req.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      token = req.cookies["token"];
    }

    if (!token) {
      res.status(401).json({ message: "No token on requset" });
      return;
    }

    try {
      const { id } = await this.jwt.verify(token);
      const user = await this.userRepository.findById(id);
      if (user === null) {
        return res.status(401).json({ message: "User not found" });
      }
      this.jwt.secureToken(res, token);
      res.status(200).json({ token, username: user.username, admin: user.admin });
    } catch (error) {
      return res.status(401).json({ message: "Invalid jwt token" });
    }
  };

  csrf = async (req: Request, res: Response) => {
    const csrfToken = await this.encryptor.hash(this.csrfToken);
    res.status(200).json({ csrfToken });
  };
}
