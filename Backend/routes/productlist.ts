import { Router } from "express";

import { getAllProducts, getProductsByCategory } from "../Controllers/productListController.ts";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductsByCategory);

export default router;
