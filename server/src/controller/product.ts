import { Request, Response, NextFunction } from "express";
import { ProductRepository } from "../repository/product";

// no need to do validate of req here.

export default class ProductController {
  productRepository: ProductRepository;
  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  getProducts = async (req: Request, res: Response) => {
    const products = await this.productRepository.findAll();
    res.status(200).json(products);
  };

  getPopuler = async (req: Request, res: Response) => {
    const amount = req.query.amount;

    if (typeof amount !== "string") {
      return res.status(400).json({ message: "Bad request - invalid query type." });
    }

    const products = await this.productRepository.findPopuler(parseInt(amount));
    res.status(200).json(products);
  };

  getByCategory = async (req: Request, res: Response) => {
    const category = req.query.category;

    if (typeof category !== "string") {
      return res.status(400).json({ message: "Bad request - invalid query type." });
    }

    const products = await this.productRepository.findByCategory(category);
    res.status(200).json(products);
  };

  getProduct = async (req: Request, res: Response) => {
    const id = req.params.id;

    const product = await this.productRepository.findById(id);
    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  };

  create = async (req: Request, res: Response) => {
    const product = req.body;
    const id = await this.productRepository.create(product);
    return res.status(201).json({ id });
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id;
    const partialProduct = req.body;

    const found = await this.productRepository.findById(id);
    if (!found) {
      res.status(404).json({ message: "Product not found" });
    }

    await this.productRepository.update(id, partialProduct);
    return res.status(200);
  };

  delete = async (req: Request, res: Response) => {
    const id = req.params.id;
    const found = await this.productRepository.findById(id);

    if (!found) {
      return res.status(404).json({ message: "Product not found" });
    }

    await this.productRepository.delete(id);
    return res.status(204);
  };

  increaseSale = async (req: Request, res: Response) => {
    const id = req.params.id;

    const found = await this.productRepository.findById(id);

    if (!found) {
      return res.status(404).json({ message: "Product not found" });
    }

    await this.productRepository.update(found.id, { ...found, sales: found.sales + 1 });

    return res.status(200);
  };
}
