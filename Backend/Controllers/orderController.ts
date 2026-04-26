import { PrismaClient } from "@prisma/client";
import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import sendOrderConfirmationEmail from "../utils/emailutil.ts";

const prisma = new PrismaClient();

interface CreateOrderBody {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  payment?: string;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const createOrder = async (
  req: Request<ParamsDictionary, unknown, CreateOrderBody>,
  res: Response,
) => {
  try {
    const { name, email, phone, address, city, zip, payment } = req.body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(phone) ||
      !isNonEmptyString(address) ||
      !isNonEmptyString(city) ||
      !isNonEmptyString(zip) ||
      !isNonEmptyString(payment)
    ) {
      return res.status(400).json({ error: "All order fields are required" });
    }

    const order = await prisma.order.create({
      data: { name, email, phone, address, city, zip, payment },
    });
    await sendOrderConfirmationEmail(email, order.id);
    return res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ error: "Failed to place order" });
  }
};

export const getOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};
