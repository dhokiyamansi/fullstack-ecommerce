const express = require("express");
const { PrismaClient } = require("@prisma/client");
const sendOrderConfirmationEmail = require("../utils/emailutil"); 

const prisma = new PrismaClient();
const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, city, zip, payment } = req.body;
    const order = await prisma.order.create({
      data: { name, email, phone, address, city, zip, payment },
    });
    await sendOrderConfirmationEmail(email, order.id);
    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Get All Orders
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;



