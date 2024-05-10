import { Schema, model } from "mongoose";

type OptionT = Record<string, string[]>;

export type ProductT = {
  name: string;
  price: number;
  category: string;
  url: string;
  createdAt: Date;
  option: OptionT;
  sales: number;
  id: string;
};

const productSchema = new Schema<ProductT>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  url: { type: String, required: true },
  option: {
    type: Object,
    required: true,
  },
  sales: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

setSchemaID(productSchema);

type ProductSchemaT = typeof productSchema;

const Product = model("Product", productSchema);

function setSchemaID(schema: ProductSchemaT) {
  schema.virtual("id").get(function () {
    return this._id.toString();
  });
  schema.set("toJSON", { virtuals: true });
  schema.set("toObject", { virtuals: true });
}

export interface ProductRepository {
  findAll: () => Promise<ProductT[]>;
  findPopuler: (amount: number) => Promise<ProductT[]>;
  findByCategory: (category: string) => Promise<ProductT[]>;
  findById: (id: string) => Promise<ProductT | null>;
  create: (product: Omit<ProductSchemaT, "id" | "createdAt">) => Promise<string>;
  delete: (id: string) => Promise<string>;
}
