import { Schema, model } from "mongoose";
import { ProductCreateT, ProductT, ProductUpdateT } from "../schema/product";

export interface ProductRepository {
  findAll: () => Promise<ProductT[]>;
  findPopuler: (amount: number) => Promise<ProductT[]>;
  findByCategory: (category: string) => Promise<ProductT[]>;
  findById: (id: string) => Promise<ProductT | null>;
  create: (product: ProductCreateT) => Promise<string>;
  update: (id: string, product: ProductUpdateT) => Promise<void>;
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
    return Product.findById(id).catch(() => null);
  },
  create: async (product: ProductCreateT): Promise<string> => {
    return new Product(product).save().then((data) => data.id);
  },
  update: async (id: string, product: ProductUpdateT) => {
    return Product.findByIdAndUpdate(id, product, { new: true }).then(() => {});
  },
  delete: async (id: string) => {
    return Product.findByIdAndDelete(id).then(() => {});
  },
};
