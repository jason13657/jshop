import { z } from "zod";

export const productSchema = z
  .object({
    name: z.string(),
    price: z.number(),
    category: z.string(),
    url: z.string(),
    updatedAt: z.date(),
    createdAt: z.date(),
    option: z.record(z.array(z.string())),
    sales: z.number(),
    id: z.string(),
  })
  .strict();

export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sales: true,
});

export const partialProductSchema = productSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial();

export type ProductT = z.infer<typeof productSchema>;

export type ProductCreateT = z.infer<typeof createProductSchema>;

export type ProductUpdateT = z.infer<typeof partialProductSchema>;
