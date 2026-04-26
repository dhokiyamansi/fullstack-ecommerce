import { Router } from "express";

import {
  addToCart,
  decreaseQuantity,
  getCart,
  increaseQuantity,
  removeItem,
} from "../Controllers/cartController.ts";
import authMiddleware from "../middleware/auth.ts";

const router = Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.post("/increase/:productId", authMiddleware, increaseQuantity);
router.post("/decrease/:productId", authMiddleware, decreaseQuantity);
router.delete("/remove/:productId", authMiddleware, removeItem);

export default router;
