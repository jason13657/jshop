import { AxiosInstance } from "axios";
import { getFakeCreateProductTObject, getFakeUserTObject } from "../../utils/fake";

export async function createAccount(request: AxiosInstance, admin: boolean) {
  const { username, name, email, password } = getFakeUserTObject();
  const res = await request.post("/auth/signup", { username, name, email, password, admin });

  return res;
}

export async function createProduct(request: AxiosInstance) {
  const product = getFakeCreateProductTObject();
  const user = await createAccount(request, true);

  expect(user.status).toBe(201);

  const created = await request.post("/product", product, {
    headers: { Authorization: `Bearer ${user.data.token}` },
  });
  expect(created.status).toBe(201);
  expect(created.data.id).toBeDefined();

  return { created, token: user.data.token, product };
}
