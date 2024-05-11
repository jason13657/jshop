import { Router } from "express";
import AuthController from "../controller/auth";
import { validate } from "../middleware/validate/validate";
import { validateCredential, validateSignup } from "../middleware/validate/auth";

const router = Router();

export const authRouter = (authController: AuthController) => {
  // last middleware contains jwt token
  router.post("/signup", validateSignup, authController.signUp);
  router.post("/login", validateCredential, authController.login);
  router.get("/me", authController.me);
  router.get("/csrf-token", authController.csrf);
  return router;
};
