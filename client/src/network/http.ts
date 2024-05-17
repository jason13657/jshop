import axios, { AxiosHeaders, AxiosInstance } from "axios";
import AuthErrorEventBus from "../utils/auth_error";

type ReqOptions<T> = {
  method: keyof AxiosInstance;
  headers?: AxiosHeaders;
  body?: T;
};

export class HTTPClient {
  private client: AxiosInstance;
  private getCSRFToken: () => string | undefined;
  constructor(baseURL: string, getCSRFToken: () => string | undefined) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    this.getCSRFToken = getCSRFToken;
  }
  async fetch<T>(url: string, options: ReqOptions<T>) {
    const { method, headers, body } = options;
    const req = {
      url,
      method,
      headers,
      data: body,
    };

    this.client.defaults.headers.common["jshop-token"] = this.getCSRFToken() ?? "";
    return this.client(req)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response.status == 401) {
          AuthErrorEventBus.getInstance().notify(err);
          return;
        }
        if (err.response && err.response.data) {
          throw Error(err.response.data.message);
        } else {
          throw Error("Request Error");
        }
      });
  }
}
