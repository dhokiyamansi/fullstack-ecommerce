const express = require("express");
const { getAllProducts, getProductsByCategory } = require("../Controllers/productListController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductsByCategory);


router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id
      const product = await Product.find({"category": { $regex: id, $options: "i" }});
      if (!product || product.length === 0) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports= router;
