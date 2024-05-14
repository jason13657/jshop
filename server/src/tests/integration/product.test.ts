import { Server, startServer, stopServer } from "../../..";
import axios, { AxiosInstance } from "axios";
import { dropDatabase } from "../../db/database";
import { getFakeCreateProductTObject, getFakeProductTObject } from "../../utils/fake";
import { createAccount, createProduct } from "./utils";
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
    //actually, i didn't need to do admin middlewate test. it can be done on auth integration side.
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

  describe("GET /product", () => {
    it("returns 200 with product", async () => {
      const created1 = await createProduct(request);
      const created2 = await createProduct(request);

      const res = await request.get(`/product`, {});

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("GET /product/category", () => {
    it("returns 200 with category product", async () => {
      const created1 = await createProduct(request);
      const created2 = await createProduct(request);

      const res = await request.get(`/product/category?category=${created1.product.category}`);

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThanOrEqual(1);
      expect(res.data[0].category).toBe(created1.product.category);
    });
  });

  describe("GET /product/populer", () => {
    it("returns 200 with pupular product - orderd by sales", async () => {
      const created1 = await createProduct(request);
      const created2 = await createProduct(request);
      const created3 = await createProduct(request);

      const purchased = await request.put(
        `/product/purchase/${created2.created.data.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${created1.token}` },
        }
      );
      expect(purchased.status).toBe(200);

      const res = await request.get(`/product/populer?amount=10`);

      expect(res.status).toBe(200);
      expect(res.data.length).toBeGreaterThanOrEqual(3);
      expect(res.data[0].name).toBe(created2.product.name);
    });
  });

  describe("GET /product:id", () => {
    it("returns 200 with product", async () => {
      const { created, token, product } = await createProduct(request);

      const res = await request.get(`product/${created.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(200);
      expect(res.data).toMatchObject({
        ...product,
        id: created.data.id,
        sales: 0,
        updatedAt: res.data.updatedAt,
        createdAt: res.data.createdAt,
      });
    });
  });

  describe("PUT /product/:id", () => {
    it("returns 200 after updated", async () => {
      const { created, token, product } = await createProduct(request);

      const res = await request.put(
        `/product/${created.data.id}`,
        { name: "name" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      expect(res.status).toBe(200);
    });
  });
  describe("PUT /product/purchase:id", () => {
    it("returns 200 after updated increase sales", async () => {
      const { created, token } = await createProduct(request);

      const res = await request.put(
        `/product/purchase/${created.data.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const increased = await request.get(`product/${created.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(200);
      expect(increased.data).toMatchObject({ ...increased.data, sales: 1 });
    });
  });
  describe("DELETE /product", () => {
    it("return 204 after delete", async () => {
      const { created, token } = await createProduct(request);
      const res = await request.delete(`/product/${created.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const found = await request.get(`product/${created.data.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(res.status).toBe(204);
      expect(found.status).toBe(404);
    });
  });
});
