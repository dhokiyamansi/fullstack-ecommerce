const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/auth");
const mongoose = require("mongoose");


const router = express.Router();


router.post("/add", authMiddleware, async (req, res) => {
  try {
      const { items } = req.body; // Expecting an array of cart items from localStorage
      const userId = req.user.id; // Extracted from token
      if (!items) {
          return res.status(400).json({ error: "Invalid cart data", success: false });
      }
      let cart = await Cart.findOne({ userId });
      if (!cart) {
          cart = new Cart({ userId, items: [] });
      }
      items.forEach((localItem) => {
          const productId = new mongoose.Types.ObjectId(localItem._id);
          const existingItem = cart.items.find((item) => item.productId.equals(productId));
          if (existingItem) {
              existingItem.quantity += localItem.quantity;
          } else {
              cart.items.push({
                  productId,
                  name: localItem.name,
                  price: localItem.price,
                  quantity: localItem.quantity,
              });
          }
      });
      cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
      await cart.save();
      return res.status(201).json({ message: "Cart updated successfully", success: true });
  } catch (error) {
      return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});


  router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) return res.json({ items: [] });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//Increase quantity
router.post("/increase/:productId",authMiddleware, async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((item) => item._id.equals(productId));
        if (!item) return res.status(404).json({ message: "Product not in cart" });
        item.quantity += 1;
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.json({ message: "Quantity increased", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Decrease quantity
router.post("/decrease/:productId", authMiddleware, async (req, res) => {
    try {
        const productId = new mongoose.Types.ObjectId(req.params.productId);
        console.log("product id",productId);
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        const item = cart.items.find((item) => item._id.equals(productId));
        if (!item) return res.status(404).json({ message: "Product not in cart" });
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.items = cart.items.filter((item) => !item._id.equals(productId));
        }
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.json({ message: "Quantity updated", cart });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Remove an item from cart
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        const productId = new mongoose.Types.ObjectId(req.params.productId);
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });
        cart.items = cart.items.filter((item) => !item._id.equals(productId));
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        res.json({ message: "Item removed", cart });
    } catch (error) { 
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router



{/*
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        // Validate ObjectId
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const itemIndex = cart.items.findIndex((item) => item.productId.equals(new ObjectId(productId)));
        if (itemIndex === -1) {
            return res.status(400).json({ message: "Item not found in cart" });
        }
        // Remove the item from the cart
        cart.items.splice(itemIndex, 1);
        // Recalculate total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        return res.json({ message: "Item removed", cart });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});
// Clear entire cart
router.delete("/clear", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        await Cart.deleteOne({ userId });
        res.json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
*/}


