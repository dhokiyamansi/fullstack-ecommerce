const express = require("express");
const { getAllProducts, getProductsByCategory } = require("../Controllers/productListController");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductsByCategory);

module.exports = router;