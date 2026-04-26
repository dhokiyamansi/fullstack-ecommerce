import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import Product from "../models/Product.ts";

interface ProductIdParams extends ParamsDictionary {
  id: string;
}

interface ProductRequestBody {
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  image?: string;
}

export const getProductById = async (req: Request<ProductIdParams>, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const createProduct = async (
  req: Request<ParamsDictionary, unknown, ProductRequestBody>,
  res: Response,
) => {
  try {
    const { name, category, price, description, image } = req.body;
    const newProduct = new Product({ name, category, price, description, image });
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add product" });
  }
};

export const updateProduct = async (
  req: Request<ProductIdParams, unknown, ProductRequestBody>,
  res: Response,
) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (req: Request<ProductIdParams>, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};
