import { AuthT, LoginAuthT, SignUpAuthT } from "../model/auth";
import { HTTPClient } from "../network/http";

export default class AuthService {
  private httpClient: HTTPClient;
  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  signup = async (auth: SignUpAuthT): Promise<AuthT> => {
    return this.httpClient.fetch("/auth/signup", {
      method: "post",
      body: auth,
    });
  };

  login = async (auth: LoginAuthT): Promise<AuthT> => {
    return this.httpClient.fetch("/auth/login", {
      method: "post",
      body: auth,
    });
  };

  me = async (): Promise<AuthT> => {
    return this.httpClient.fetch("/auth/me", {
      method: "get",
    });
  };

  signout = async () => {
    return this.httpClient.fetch("/auth/signout", {
      method: "post",
    });
  };

  csrf = async (): Promise<Record<"csrfToken", string>> => {
    return this.httpClient.fetch("/auth/csrf-token", {
      method: "get",
    });
  };
}
