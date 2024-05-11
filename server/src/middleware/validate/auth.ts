import { z, ZodError } from "zod";
import { validate } from "./validate";

const credential = {
  username: z.string().trim().min(5, "Username should be at least 5 characters."),
  password: z.string().trim().min(7, "Password should be at least 7 characters."),
};

const signUp = {
  ...credential,
  name: z.string().trim().min(1, "Name should not be empty"),
  email: z.string().email("This is not a valid email."),
};

export const validateCredential = validate(z.object(credential));

export const validateSignup = validate(z.object(signUp));
