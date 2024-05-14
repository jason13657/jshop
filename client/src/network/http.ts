import axios, { AxiosHeaders, AxiosInstance } from "axios";

type ReqOptions<T> = {
  method: keyof AxiosInstance;
  headers?: AxiosHeaders;
  body?: Record<string, T>;
};

export class HTTPClient {
  private client: AxiosInstance;
  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
  }
  async fetch<T>(url: string, options: ReqOptions<T>) {
    const { method, headers, body } = options;
    const req = {
      url,
      method,
      headers,
      data: body,
    };

    return this.client(req)
      .then((res) => res.data)
      .catch((err) => {
        if (err.response && err.response.data) {
          throw Error(err.response.data.message);
        } else {
          throw Error("Request Error");
        }
      });
  }
}
