import { UserT } from "../repository/user";
import { faker } from "@faker-js/faker";
import { ProductCreateT, ProductT, ProductUpdateT } from "../schema/product";

export function getFakeUserTObject(options?: { admin?: boolean }): UserT {
  const fakeUser: UserT = {
    username: faker.word.words(),
    name: faker.word.words(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.anytime(),
    updatedAt: faker.date.anytime(),
    id: faker.string.alphanumeric(32),
    admin: options?.admin ?? false,
  };

  if (options && options.admin && options.admin == true) {
    fakeUser.admin = true;
  }

  return fakeUser;
}

export function getFakeToken() {
  return faker.string.alphanumeric(128);
}

export function getFakeWord() {
  return faker.word.words(1);
}

export function getFakeProductTObject(): ProductT {
  return {
    name: faker.word.words(2),
    price: faker.number.int(500),
    category: faker.word.words(),
    url: faker.internet.url(),
    sales: 0,
    option: { [faker.word.words()]: [faker.word.words(), faker.word.words(), faker.word.words()] },
    updatedAt: new Date(),
    createdAt: new Date(),
    id: faker.string.uuid(),
  };
}

export function getFakeCreateProductTObject(): ProductCreateT {
  return {
    name: faker.word.words(),
    price: faker.number.int(500),
    category: faker.word.words(),
    url: faker.internet.url(),
    option: { [faker.word.words()]: [faker.word.words(), faker.word.words(), faker.word.words()] },
  };
}
