import AuthMiddleware from "../auth";

import { faker } from "@faker-js/faker";
import httpMocks from "node-mocks-http";
import { userRepository } from "../../repository/user";
import { jwtHandler } from "../../security/jwt";

jest.mock("../../security/jwt");
jest.mock("../../repository/user");

describe("Auth Middlewere", () => {
  let authMiddleware: AuthMiddleware;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware(userRepository, jwtHandler);
  });

  describe("With Auth", () => {});
});
