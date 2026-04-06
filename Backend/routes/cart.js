const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} = require("../Controllers/cartController");

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.post("/increase/:productId", authMiddleware, increaseQuantity);
router.post("/decrease/:productId", authMiddleware, decreaseQuantity);
router.delete("/remove/:productId", authMiddleware, removeItem);

module.exports = router;
