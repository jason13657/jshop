import { UserT } from "../repository/user";
import { faker } from "@faker-js/faker";

export function getFakeUserTObject(): UserT {
  return {
    username: faker.word.words(),
    name: faker.word.words(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    id: faker.string.alphanumeric(),
  };
}
