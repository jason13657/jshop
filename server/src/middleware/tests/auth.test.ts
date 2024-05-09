import AuthMiddleware from "../auth";

import httpMocks from "node-mocks-http";
import { UserT, userRepository } from "../../repository/user";
import { jwtHandler } from "../../security/jwt";
import { getFakeJWTToken, getFakeUserTObject } from "../../utils/fake";

jest.mock("../../security/jwt");
jest.mock("../../repository/user");

describe("Auth Middlewere", () => {
  let authMiddleware: AuthMiddleware;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware(userRepository, jwtHandler);
  });

  describe("With auth", () => {
    it("returns 401 without Bearer Authorization header", async () => {
      const req = httpMocks.createRequest({ method: "GET", url: "/fake" });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await authMiddleware.withAuth(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("No Bearer on header");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 401 when user not found by user id", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: "Bearer 12345",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: "id" }));
      userRepository.findById = jest.fn((id) => Promise.resolve(null));

      await authMiddleware.withAuth(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("User not found");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("passes with valid Authorization header and token", async () => {
      const token = getFakeJWTToken();

      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const user = getFakeUserTObject();

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: user.id }));
      userRepository.findById = jest.fn((id) => Promise.resolve(user));

      await authMiddleware.withAuth(req, res, next);

      expect(req).toMatchObject({ userId: user.id, token });
      expect(next).toHaveBeenCalledTimes(1);
    });
    it("returns 401 for the request with invalid JWT", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer 12345`,
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtHandler.verify = jest.fn((token) => Promise.reject("Faild to decode"));

      await authMiddleware.withAuth(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Invalid jwt token");
      expect(next).toHaveBeenCalledTimes(0);
    });
  });

  describe("With admin", () => {
    it("returns 401 without Bearer Authorization header", async () => {
      const req = httpMocks.createRequest({ method: "GET", url: "/fake" });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await authMiddleware.withAdmin(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("No Bearer on header");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 401 when user not found by user id", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: "Bearer 12345",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: "id" }));
      userRepository.findById = jest.fn((id) => Promise.resolve(null));

      await authMiddleware.withAdmin(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("User not found");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 401 when admin is false or undefined from token", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: "Bearer 12345",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const user = getFakeUserTObject({ admin: true });

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: "id" }));
      userRepository.findById = jest.fn((id) => Promise.resolve(user));

      await authMiddleware.withAdmin(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Request is not from admin");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("returns 401 when admin is false or undefined from repository", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: "Bearer 12345",
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const user = getFakeUserTObject();

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: "id", admin: true }));
      userRepository.findById = jest.fn((id) => Promise.resolve(user));

      await authMiddleware.withAdmin(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Request is not from admin");
      expect(next).toHaveBeenCalledTimes(0);
    });
    it("passes with valid Authorization header and token and repository data", async () => {
      const token = getFakeJWTToken();
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();
      const user = getFakeUserTObject({ admin: true });

      jwtHandler.verify = jest.fn((token) => Promise.resolve({ id: user.id, admin: true }));
      userRepository.findById = jest.fn((id) => Promise.resolve(user));

      await authMiddleware.withAdmin(req, res, next);

      expect(req).toMatchObject({ userId: user.id, token });
      expect(next).toHaveBeenCalledTimes(1);
    });
    it("returns 401 for the request with invalid JWT", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/fake",
        headers: {
          Authorization: `Bearer 12345`,
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      jwtHandler.verify = jest.fn((token) => Promise.reject("Faild to decode"));

      await authMiddleware.withAdmin(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe("Invalid jwt token");
      expect(next).toHaveBeenCalledTimes(0);
    });
  });
});
