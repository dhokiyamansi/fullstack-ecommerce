const mongoose = require("mongoose");
const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(items) || items.length === 0) {
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
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.json({ items: [] });
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.equals(productId));
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity += 1;
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
    return res.json({ message: "Quantity increased", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const decreaseQuantity = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.equals(productId));
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
    return res.json({ message: "Quantity updated", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const removeItem = async (req, res) => {
  try {
    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialCount = cart.items.length;
    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    if (cart.items.length === initialCount) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();
    return res.json({ message: "Item removed", cart });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
};