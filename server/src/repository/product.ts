import { Schema, model } from "mongoose";

type OptionT = Record<string, string[]>;

export type ProductT = {
  name: string;
  price: number;
  category: string;
  url: string;
  updatedAt: Date;
  createdAt: Date;
  option: OptionT;
  sales: number;
  id: string;
};

export interface ProductRepository {
  findAll: () => Promise<ProductT[]>;
  findPopuler: (amount: number) => Promise<ProductT[]>;
  findByCategory: (category: string) => Promise<ProductT[]>;
  findById: (id: string) => Promise<ProductT | null>;
  create: (product: Omit<ProductSchemaT, "id" | "createdAt" | "updatedAt" | "sales">) => Promise<string>;
  update: (id: string, product: Partial<ProductT>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

const productSchema = new Schema<ProductT>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    url: { type: String, required: true },
    option: {
      type: Object,
      required: true,
    },
    sales: { type: Number, required: false, default: 0 },
    createdAt: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

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

export const productRepository: ProductRepository = {
  findAll: async (): Promise<ProductT[]> => {
    return Product.find().sort({ createdAt: -1 });
  },
  findPopuler: async (amount: number): Promise<ProductT[]> => {
    return Product.find().sort({ sales: -1 }).limit(amount);
  },
  findByCategory: async (category: string): Promise<ProductT[]> => {
    return Product.find({ category }).sort({ createdAt: -1 });
  },
  findById: async (id: string): Promise<ProductT | null> => {
    return Product.findById(id);
  },
  create: async (product: Omit<ProductSchemaT, "id" | "createdAt" | "updatedAt" | "sales">): Promise<string> => {
    return new Product(product).save().then((data) => data.id);
  },
  update: async (id: string, product: Partial<ProductT>) => {
    return Product.findByIdAndUpdate(id, product, { returnOriginal: false }).then(() => {});
  },
  delete: async (id: string) => {
    return Product.findByIdAndDelete(id).then(() => {});
  },
};
