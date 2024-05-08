import bcrypt, { hash } from "bcrypt";
import { config } from "../../config";

export interface PasswordEncryptor {
  hash: (password: string) => Promise<string>;
  compare: (password: string, comparing: string) => Promise<boolean>;
}

export const passwordEncryptor = {
  hash: (password: string) => {
    return bcrypt.hash(password, config.security.saltRounds);
  },
  compare: (password: string, comparing: string) => {
    return bcrypt.compare(password, comparing);
  },
};
