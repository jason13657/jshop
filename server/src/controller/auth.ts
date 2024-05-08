import { Request, Response, NextFunction } from "express";
import { UserRepository, UserT } from "../repository/user";
import { PasswordEncryptor } from "../security/password";
import { JWTHandler, createJwtToken } from "../security/jwt";

export default class AuthController {
  private userRepository: UserRepository;
  private passwordEncryptor: PasswordEncryptor;
  private jwt: JWTHandler;

  constructor(userRepository: UserRepository, jwtHandler: JWTHandler, passwordEncryptor: PasswordEncryptor) {
    this.userRepository = userRepository;
    this.passwordEncryptor = passwordEncryptor;
    this.jwt = jwtHandler;
  }

  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = await this.userRepository.findByUsername(username);
    if (!user) return res.status(401).json({ message: "invalid username" });

    const isPasswordValid = this.passwordEncryptor.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "invalid password" });

    const token = this.jwt.create(user.id, user.admin && user.admin);
    res.status(201).json({ token, username });
  };

  signUp = async (req: Request, res: Response) => {
    const { username, password, email, name } = req.body;

    const usernameCheck = await this.userRepository.findByUsername(username);
    if (usernameCheck) return res.status(409).json({ message: "Username already exists" });

    const emailCheck = await this.userRepository.findByEmail(email);
    if (emailCheck) return res.status(409).json({ message: "Email already exists" });

    const hashed = await this.passwordEncryptor.hash(password);

    const userId = await this.userRepository.createUser({
      username,
      name,
      password: hashed,
      email,
      admin: false,
    });

    const token = this.jwt.create(userId);

    res.status(201).json({ token, username });
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!(authHeader && authHeader.startsWith("Bearer "))) {
      return res.status(401).json({ message: "No bearer request" });
    }
    const token = authHeader.split(" ")[1];

    try {
      const { id } = this.jwt.verify(token);
      const user = await this.userRepository.findById(id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      res.status(200).json({ token, username: user.username });
    } catch (error) {
      return res.status(401).json({ message: "Invalid jwt token" });
    }
  };
}
