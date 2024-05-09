import AuthController from "../auth";
import httpMocks from "node-mocks-http";
import { jwtHandler } from "../../security/jwt";
import { userRepository } from "../../repository/user";
import { getFakeToken, getFakeUserTObject } from "../../utils/fake";
import { encryptor } from "../../security/encryptor";

// Please use async function!!!!!!!!!!!!! async and await!!!!!!

jest.mock("../../repository/user");
jest.mock("../../security/encryptor");
jest.mock("../../security/jwt");

describe("Auth Controller", () => {
  let authController: AuthController;

  beforeEach(() => {
    const csrfToken = getFakeToken();
    authController = new AuthController(userRepository, jwtHandler, encryptor, csrfToken);
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
      encryptor.compare = jest.fn(() => Promise.resolve(false));

      await authController.login(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Invalid password");
    });
    it("passess with valid username and password - admin case", async () => {
      const token = getFakeToken();
      const user = getFakeUserTObject({ admin: true });
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
      encryptor.compare = jest.fn(() => Promise.resolve(true));
      jwtHandler.create = jest.fn(() => token);

      await authController.login(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({
        token: token,
        username: user.username,
        admin: user.admin ?? false,
      });
    });
    it("passess with valid username and password", async () => {
      const token = getFakeToken();
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
      encryptor.compare = jest.fn(() => Promise.resolve(true));
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

  describe("Sign Up", () => {
    it("returns 409 when username already exists", async () => {
      const user = getFakeUserTObject();
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          username: user.username,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findByUsername = jest.fn((username) => Promise.resolve(user));

      await authController.signUp(req, res);

      expect(res.statusCode).toBe(409);
      expect(res._getJSONData().message).toBe("Username already exists");
    });

    it("returns 409 when email already exists", async () => {
      const user = getFakeUserTObject();
      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          username: user.username,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findByUsername = jest.fn((username) => Promise.resolve(null));
      userRepository.findByEmail = jest.fn((username) => Promise.resolve(user));

      await authController.signUp(req, res);

      expect(res.statusCode).toBe(409);
      expect(res._getJSONData().message).toBe("Email already exists");
    });

    it("returns 201 and token, username when sign up success", async () => {
      const user = getFakeUserTObject({ admin: false });
      const token = getFakeToken();

      const req = httpMocks.createRequest({
        method: "POST",
        body: {
          username: user.username,
          name: user.name,
          email: user.email,
          password: user.password,
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findByUsername = jest.fn((username) => Promise.resolve(null));
      userRepository.findByEmail = jest.fn((username) => Promise.resolve(null));
      userRepository.createUser = jest.fn();
      jwtHandler.create = jest.fn(() => token);

      await authController.signUp(req, res);

      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toMatchObject({ token, username: user.username });
    });
  });

  describe("Me", () => {
    it("returns 401 without token on header or cookie", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
      });
      const res = httpMocks.createResponse();

      await authController.me(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("No token on requset");
    });
    it("passes with valid Authorization header and token", async () => {
      const token = getFakeToken();
      const user = getFakeUserTObject({ admin: true });
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = httpMocks.createResponse();

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: user.id }));
      userRepository.findById = jest.fn((id) => Promise.resolve(user));

      await authController.me(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({ token, username: user.username, admin: user.admin ?? false });
    });
    it("passes with valid token with in cookies ", async () => {
      const token = getFakeToken();
      const user = getFakeUserTObject({ admin: true });
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {},
        cookies: { token },
      });
      const res = httpMocks.createResponse();

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: user.id }));
      userRepository.findById = jest.fn((id) => Promise.resolve(user));

      await authController.me(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toMatchObject({ token, username: user.username, admin: user.admin ?? false });
    });
    it("returns 401 when username is not found", async () => {
      const token = getFakeToken();
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = httpMocks.createResponse();

      userRepository.findById = jest.fn((username) => Promise.resolve(null));

      await authController.me(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("User not found");
    });
    it("returns 401 when jwt token is invalid", async () => {
      const token = getFakeToken();
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = httpMocks.createResponse();

      jwtHandler.verify = jest.fn((token) => Promise.reject());

      await authController.me(req, res);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Invalid jwt token");
    });
  });

  describe("Sign out", () => {
    it("return 200 and cleans response token", () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.cookie("token", "easter egg");

      authController.signOut(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().message).toBe("Sign out");
      expect(res.cookies["token"].value).toBe("");
    });
  });

  describe("Csrf", () => {
    it("returns 200 and token", async () => {
      const token = getFakeToken();
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();

      encryptor.hash = jest.fn(() => Promise.resolve(token));

      await authController.csrf(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().csrfToken).toBe(token);
    });
  });
});
