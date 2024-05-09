import { Router } from "express";
import AuthController from "../controller/auth";
import { body } from "express-validator";
import { validate } from "../middleware/validate";
import AuthMiddleware from "../middleware/auth";

const validateCredential = [
  body("username") //
    .trim()
    .isLength({ min: 5 })
    .withMessage("username should be at least 5 characters."),
  body("password") //
    .trim()
    .isLength({ min: 7 })
    .withMessage("password should be at least 7 characters."),
  validate,
];

const validateSignup = [
  ...validateCredential, //
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  validate,
];

const router = Router();

export const authRouter = (authController: AuthController) => {
  // last middleware contains jwt token
  router.post("/signup", validateSignup, authController.signUp);
  router.post("/login", validateCredential, authController.login);
  router.get("/me", authController.me);
  router.get("/csrf-token", authController.csrf);
  return router;
};
