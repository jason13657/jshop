import { z, ZodError } from "zod";
import { validate } from "./validate";

const credential = validate(
  z.object({
    username: z.string().trim().min(5, "Username should be at least 5 characters."),
    password: z.string().trim().min(7, "Password should be at least 7 characters."),
  }),
  "body"
);

const signUp = validate(
  z.object({
    name: z.string().trim().min(1, "Name should not be empty."),
    email: z.string().email("This is not a valid email."),
  }),
  "body"
);

export const authValidate = {
  validateCredential: credential,
  validateSignup: [credential, signUp],
};

export type AuthValidate = typeof authValidate;
