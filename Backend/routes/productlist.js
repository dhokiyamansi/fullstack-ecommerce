const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.find({"category":id});
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports= router;