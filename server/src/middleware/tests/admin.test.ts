import { faker } from "@faker-js/faker";
import { withAdmin } from "../admin";
import httpMocks from "node-mocks-http";

import { JwtHeader } from "jsonwebtoken";
import { UserRepository } from "../../repository/user";

jest.mock("jsonwebtoken");
jest.mock("../../repository/user");

describe("Admin Middlewere", () => {
  it("test", () => {
    expect(3).toBe(3);
  });
});
