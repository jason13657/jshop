import { validate } from "./validate";
import { createProductSchema, partialProductSchema, productSchema } from "../../schema/product";
import { z } from "zod";

const productId = productSchema.pick({
  id: true,
});

const populerReqQuerySchema = z
  .object({
    amount: z.string().refine(
      (amount) => {
        if (isNaN(parseInt(amount))) {
          return false;
        } else {
          return true;
        }
      },
      {
        message: "Faild to parse to int.",
      }
    ),
  })
  .strict();

const categoryReqQuerySchema = z
  .object({
    category: z.string(),
  })
  .strict();

export const productValidate = {
  validateIdParams: validate(productId, "params"),
  validateProduct: validate(productSchema, "body"),
  validatePartialProduct: validate(partialProductSchema, "body"),
  validateCreateProduct: validate(createProductSchema, "body"),
  validatePopularQuery: validate(populerReqQuerySchema, "query"),
  validateCategoryQuery: validate(categoryReqQuerySchema, "query"),
};

export type ProductValidate = typeof productValidate;
