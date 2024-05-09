import { UserT } from "../repository/user";
import { faker } from "@faker-js/faker";

export function getFakeUserTObject(options?: { admin?: boolean }): UserT {
  const fakeUser: UserT = {
    username: faker.word.words(),
    name: faker.word.words(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    id: faker.string.alphanumeric(),
  };

  if (options && options.admin && options.admin == true) {
    fakeUser.admin = true;
  }

  return fakeUser;
}

export function getFakeJWTToken() {
  return faker.string.alphanumeric(128);
}
