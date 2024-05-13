import { Server, startServer, stopServer } from "../../..";
import axios, { AxiosInstance } from "axios";
import { dropDatabase } from "../../db/database";
import { getFakeCreateProductTObject, getFakeProductTObject } from "../../utils/fake";
import { createAccount } from "./utils";
import { token } from "morgan";
import { AddressInfo } from "net";

describe("Product APIs Integration", () => {
  let server: Server;
  let request: AxiosInstance;

  beforeAll(async () => {
    server = await startServer();

    const { port } = server.address() as AddressInfo;

    request = axios.create({
      baseURL: `http://localhost:${port}`,
      validateStatus: null,
    });
    const csrfToken = await request("/auth/csrf-token");
    request.defaults.headers.common["jshop-token"] = csrfToken.data.csrfToken;
  });

  afterAll(async () => {
    await dropDatabase();
    await stopServer(server);
  });

  describe("POST /product", () => {
    it("returns 401 with non-admin user", async () => {
      const product = getFakeProductTObject();
      const user = await createAccount(request, false);
      expect(user.status).toBe(201);

      const res = await request.post("/product", product, { headers: { Authorization: `Bearer ${user.data.token}` } });

      expect(res.status).toBe(401);
      expect(res.data.message).toBe("Request is not from admin");
      expect(res.data.id).not.toBeDefined();
    });
    it("returns 201 and id with admin user", async () => {
      const product = getFakeCreateProductTObject();
      const user = await createAccount(request, true);
      expect(user.status).toBe(201);

      const res = await request.post("/product", product, { headers: { Authorization: `Bearer ${user.data.token}` } });

      expect(res.status).toBe(201);
      expect(res.data.id).toBeDefined();
    });
    it("returns 400 with missing product key", async () => {
      const { name, ...product } = getFakeCreateProductTObject();
      const user = await createAccount(request, true);
      expect(user.status).toBe(201);

      const res = await request.post("/product", product, { headers: { Authorization: `Bearer ${user.data.token}` } });

      expect(res.status).toBe(400);
      expect(res.data.message).toBe("Required");
    });
  });
});
