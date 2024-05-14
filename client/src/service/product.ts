import { Category } from "../component/Category";
import { ProductT } from "../model/product";
import { HTTPClient } from "../network/http";

export class ProductService {
  private httpClient: HTTPClient;
  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  async getProducts(): Promise<ProductT[]> {
    return this.httpClient.fetch("/product", {
      method: "get",
    });
  }

  async getProductsByCategory(category: Category): Promise<ProductT[]> {
    return this.httpClient.fetch(`/product/category?category=${category}`, {
      method: "get",
    });
  }

  async getPopulerProducts(amount: string): Promise<ProductT[]> {
    return this.httpClient.fetch(`/product/populer?amount=${amount}`, {
      method: "get",
    });
  }
}
