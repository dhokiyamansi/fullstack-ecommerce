import { Router } from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "../Controllers/productController.ts";

const router = Router();

router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
