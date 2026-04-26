import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import mongoose from "mongoose";

import Cart, { type CartItem } from "../models/Cart.ts";

interface AddToCartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AddToCartBody {
  items?: AddToCartItem[];
}

interface ProductIdParams extends ParamsDictionary {
  productId: string;
}

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Unknown error";

const getUserId = (req: { user?: Express.Request["user"] }): string | null => {
  const userId = req.user?.id;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
};

const isValidCartItem = (item: AddToCartItem): boolean =>
  Boolean(item._id) &&
  mongoose.Types.ObjectId.isValid(item._id) &&
  typeof item.name === "string" &&
  typeof item.price === "number" &&
  Number.isFinite(item.price) &&
  typeof item.quantity === "number" &&
  Number.isInteger(item.quantity) &&
  item.quantity > 0;

const calculateTotalPrice = (items: Pick<CartItem, "price" | "quantity">[]): number =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export const addToCart = async (
  req: Request<ParamsDictionary, unknown, AddToCartBody>,
  res: Response,
) => {
  try {
    const { items } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ message: "Access Denied" });
    }

    if (!Array.isArray(items) || items.length === 0 || !items.every(isValidCartItem)) {
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

    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();
    return res.status(201).json({ message: "Cart updated successfully", success: true });
  } catch (error: unknown) {
    return res.status(500).json({ error: "Internal Server Error", message: getErrorMessage(error) });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.json({ items: [] });
    return res.json(cart);
  } catch (error: unknown) {
    return res.status(500).json({ message: "Server error", error: getErrorMessage(error) });
  }
};

export const increaseQuantity = async (req: Request<ProductIdParams>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.equals(productId));
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    item.quantity += 1;
    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();
    return res.json({ message: "Quantity increased", cart });
  } catch (error: unknown) {
    return res.status(500).json({ message: "Server error", error: getErrorMessage(error) });
  }
};

export const decreaseQuantity = async (req: Request<ProductIdParams>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.equals(productId));
    if (!item) return res.status(404).json({ message: "Product not in cart" });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    }

    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();
    return res.json({ message: "Quantity updated", cart });
  } catch (error: unknown) {
    return res.status(500).json({ message: "Server error", error: getErrorMessage(error) });
  }
};

export const removeItem = async (req: Request<ProductIdParams>, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
      return res.status(400).json({ message: "Invalid product id" });
    }

    const productId = new mongoose.Types.ObjectId(req.params.productId);
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Access Denied" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialCount = cart.items.length;
    cart.items = cart.items.filter((item) => !item.productId.equals(productId));
    if (cart.items.length === initialCount) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.totalPrice = calculateTotalPrice(cart.items);
    await cart.save();
    return res.json({ message: "Item removed", cart });
  } catch (error: unknown) {
    return res.status(500).json({ message: "Server error", error: getErrorMessage(error) });
  }
};
