import { UserT } from "../repository/user";
import { faker } from "@faker-js/faker";

export function getFakeUserTObject(options?: { admin?: boolean }): UserT {
  const fakeUser: UserT = {
    username: faker.word.words(),
    name: faker.word.words(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    id: faker.string.alphanumeric(32),
  };

  if (options && options.admin && options.admin == true) {
    fakeUser.admin = true;
  }

  return fakeUser;
}

export function getFakeToken() {
  return faker.string.alphanumeric(128);
}
