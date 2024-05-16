import { HTTPClient } from "../network/http";

export default class AuthService {
  private httpClient: HTTPClient;
  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  async signup(auth: SignUpAuthT): Promise<AuthT> {
    return this.httpClient.fetch("/auth/signup", {
      method: "post",
      body: auth,
    });
  }

  async login(auth: LoginAuthT): Promise<AuthT> {
    return this.httpClient.fetch("/auth/login", {
      method: "post",
      body: auth,
    });
  }

  async me(): Promise<AuthT> {
    return this.httpClient.fetch("/auth/me", {
      method: "get",
    });
  }

  async signout() {
    return this.httpClient.fetch("/auth/signout", {
      method: "post",
    });
  }
}
