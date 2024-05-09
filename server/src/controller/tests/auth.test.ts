import AuthController from "../auth";
import { faker } from "@faker-js/faker";
import httpMocks from "node-mocks-http";
import { passwordEncryptor } from "../../security/password";
import { jwtHandler } from "../../security/jwt";
import { userRepository } from "../../repository/user";
import { getFakeUserTObject } from "../../utils/fake";

// Please use async function!!!!!!!!!!!!! async and await!!!!!!

jest.mock("../../repository/user");
jest.mock("../../security/password");
jest.mock("../../security/jwt");

describe("Auth Controller", () => {
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController(userRepository, jwtHandler, passwordEncryptor);
  });

  describe("Login", () => {
    it("returns 401 when username is not found", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/fake",
        body: {
          username: "fakeuser",
          password: "password",
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findByUsername = jest.fn((username) => Promise.resolve(null));

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Invalid username");
    });
    it("returns 401 when password is not valid", async () => {
      const user = getFakeUserTObject();
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/fake",
        body: {
          username: user.username,
          password: user.password,
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findByUsername = jest.fn((username) => Promise.resolve(user));
      passwordEncryptor.compare = jest.fn(() => Promise.resolve(false));

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Invalid password");
    });
    it("passess with valid username and password", async () => {
      const token = faker.string.alphanumeric(128);
      const user = getFakeUserTObject();
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/fake",
        body: {
          username: user.username,
          password: user.password,
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findByUsername = jest.fn((username) => Promise.resolve(user));
      passwordEncryptor.compare = jest.fn(() => Promise.resolve(true));
      jwtHandler.create = jest.fn(() => token);

      await authController.login(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        token: token,
        username: user.username,
        admin: user.admin ?? false,
      });
    });
  });
});
