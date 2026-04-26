import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import Product from "../models/Product.ts";

interface CategoryParams extends ParamsDictionary {
  id: string;
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};

export const getProductsByCategory = async (req: Request<CategoryParams>, res: Response) => {
  try {
    const category = req.params.id;
    const products = await Product.find({ category });
    return res.json(products);
  } catch (error: unknown) {
    return res.status(500).json({ error: getErrorMessage(error) });
  }
};
