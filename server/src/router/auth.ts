import { Router } from "express";
import AuthController from "../controller/auth";
import { AuthValidate } from "../middleware/validate/auth";

const router = Router();

export const authRouter = ({ validateSignup, validateCredential }: AuthValidate, authController: AuthController) => {
  // last middleware returns jwt token
  router.post("/signup", validateSignup, authController.signUp);
  router.post("/login", validateCredential, authController.login);
  router.post("/signout", authController.signOut);
  router.get("/me", authController.me);
  router.get("/csrf-token", authController.csrf);
  return router;
};
