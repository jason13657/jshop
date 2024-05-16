import { Category } from "../component/Category";
import { ProductCreateT, ProductT, ProductUpdateT } from "../model/product";
import { HTTPClient } from "../network/http";

export class ProductService {
  private httpClient: HTTPClient;
  constructor(httpClient: HTTPClient) {
    this.httpClient = httpClient;
  }

  getAll = async (): Promise<ProductT[]> => {
    return this.httpClient.fetch("/product", {
      method: "get",
    });
  };

  getByCategory = async (category: Category): Promise<ProductT[]> => {
    return this.httpClient.fetch(`/product/category?category=${category}`, {
      method: "get",
    });
  };

  getPopuler = async (amount: string): Promise<ProductT[]> => {
    return this.httpClient.fetch(`/product/populer?amount=${amount}`, {
      method: "get",
    });
  };

  create = async (product: ProductCreateT): Promise<string> => {
    return this.httpClient.fetch("/product", {
      method: "post",
      body: product,
    });
  };

  update = async (id: string, product: ProductUpdateT) => {
    return this.httpClient.fetch(`product/${id}`, {
      method: "put",
      body: product,
    });
  };

  purchase = async (id: string) => {
    return this.httpClient.fetch(`product/purchase/${id}`, {
      method: "put",
    });
  };

  delete = async (id: string) => {
    return this.httpClient.fetch(`product/purchase/${id}`, {
      method: "delete",
    });
  };
}
