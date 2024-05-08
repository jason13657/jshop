import AuthMiddleware from "../auth";

import { faker } from "@faker-js/faker";
import httpMocks from "node-mocks-http";
import { UserT, userRepository } from "../../repository/user";
import { jwtHandler } from "../../security/jwt";
import { getFakeUserTObject } from "../../utils/fake";

jest.mock("../../security/jwt");
jest.mock("../../repository/user");

describe("Auth Middlewere", () => {
  let authMiddleware: AuthMiddleware;

  beforeEach(() => {
    authMiddleware = new AuthMiddleware(userRepository, jwtHandler);
  });

  describe("With Auth", () => {
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
      const token = faker.string.alphanumeric(128);

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
});
