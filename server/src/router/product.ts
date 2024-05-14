import { Router } from "express";
import { ProductValidate } from "../middleware/validate/product";
import ProductController from "../controller/product";
import AuthMiddleware from "../middleware/auth";

const router = Router();

export const productRouter = (
  {
    validateIdParams,
    validatePartialProduct,
    validateCreateProduct,
    validatePopularQuery,
    validateCategoryQuery,
  }: ProductValidate,
  productController: ProductController,
  { withAdmin }: AuthMiddleware
) => {
  router.get("/", productController.getProducts);

  router.get("/category", validateCategoryQuery, productController.getByCategory);

  router.get("/populer", validatePopularQuery, productController.getPopuler);

  router.get("/:id", validateIdParams, productController.getProduct);

  router.post("/", withAdmin, validateCreateProduct, productController.create);

  router.delete("/:id", withAdmin, validateIdParams, productController.delete);

  router.put("/purchase/:id", withAdmin, validateIdParams, productController.increaseSale);

  router.put("/:id", withAdmin, validateIdParams, validatePartialProduct, productController.update);

  return router;
};
