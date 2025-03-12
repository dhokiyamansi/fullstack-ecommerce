const express = require("express");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
const router = express.Router();


// Create Order
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, address, city, zip, payment } = req.body;
    const order = await prisma.order.create({
      data: { name, email, phone, address, city, zip, payment },
    });
    res.status(201).json({ message: "Order saved successfully!", order });
  } catch (error) {
    res.status(500).json({ error: "Failed to save order" });
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
