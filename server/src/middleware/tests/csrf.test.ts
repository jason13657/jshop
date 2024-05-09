import { NextFunction, Request, Response } from "express";
import { validateCSRF } from "../csrf";
import { encryptor } from "../../security/encryptor";
import { config } from "../../../config";
import httpMocks from "node-mocks-http";
import { getFakeToken } from "../../utils/fake";

jest.mock("../../security/encryptor");
jest.mock("../../../config");

describe("CSRF Validate", () => {
  it("calls next for any request that is not post, pust, patch and delete", async () => {
    const req = httpMocks.createRequest({
      method: "GET",
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await validateCSRF(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
  it("returns 403 without header", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await validateCSRF(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData().message).toBe("No CSRF token on header");
    expect(next).toHaveBeenCalledTimes(0);
  });
  it("return 403 when fails to decoded csrf token", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      headers: {
        "jshop-token": "fail-token",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    encryptor.compare = jest.fn(() => Promise.resolve(false));

    await validateCSRF(req, res, next);

    expect(res.statusCode).toBe(403);
    expect(res._getJSONData().message).toBe("Invalid csrf token");
    expect(next).toHaveBeenCalledTimes(0);
  });
  it("calls next when token valid", async () => {
    const token = getFakeToken();
    const req = httpMocks.createRequest({
      method: "POST",
      headers: {
        "jshop-token": token,
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    encryptor.compare = jest.fn(() => Promise.resolve(true));

    await validateCSRF(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
