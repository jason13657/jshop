import { Router } from "express";
import AuthController from "../controller/auth";
import { body } from "express-validator";
import { validate } from "../middleware/validate";

const validateCredential = [
  body("username") //
    .trim()
    .notEmpty()
    .withMessage("usernmae should be at least 5 characters."),
  body("password") //
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters."),
  validate,
];

const validateSignup = [
  ...validateCredential, //
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("url").isURL().withMessage("Invalid URL").optional({ nullable: true, checkFalsy: true }),
  validate,
];

const router = Router();

export const authRouter = (authController: AuthController) => {
  router.post("/signup", validateSignup, authController.signUp);
  router.post("/login", validateCredential, authController.login);
  router.get("/me", authController.me);
  return router;
};