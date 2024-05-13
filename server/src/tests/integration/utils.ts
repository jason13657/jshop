import { AxiosInstance } from "axios";
import { getFakeUserTObject } from "../../utils/fake";

export async function createAccount(request: AxiosInstance, admin: boolean) {
  const { username, name, email, password } = getFakeUserTObject();
  const res = await request.post("/auth/signup", { username, name, email, password, admin });

  return res;
}
