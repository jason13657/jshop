import bcrypt, { hash } from "bcrypt";
import { config } from "../../config";

export interface Encryptor {
  hash: (value: string, saltRounds?: number) => Promise<string>;
  compare: (value: string, comparing: string) => Promise<boolean>;
}

export const encryptor: Encryptor = {
  hash: (value: string, saltRounds?: number) => {
    return bcrypt.hash(value, saltRounds ?? config.security.saltRounds);
  },
  compare: (value: string, comparing: string) => {
    return bcrypt.compare(value, comparing);
  },
};
