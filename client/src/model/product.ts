import { Category } from "../component/Category";

export type ProductT = {
  name: string;
  price: number;
  category: Category;
  url: string;
  updatedAt: Date;
  createdAt: Date;
  option: Record<string, string[]>;
  sales: number;
  id: string;
};

export type ProductCreateT = Omit<ProductT, "id" | "createdAt" | "updatedAt" | "sales">;

export type ProductUpdateT = Partial<Omit<ProductT, "id" | "createdAt" | "updatedAt">>;
