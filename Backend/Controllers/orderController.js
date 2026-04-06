const { PrismaClient } = require("@prisma/client");
const sendOrderConfirmationEmail = require("../utils/emailutil");

const prisma = new PrismaClient();

const createOrder = async (req, res) => {
  try {
    const { name, email, phone, address, city, zip, payment } = req.body;
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

const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

module.exports = {
  createOrder,
  getOrders,
};