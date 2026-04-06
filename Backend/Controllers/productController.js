const Product = require("../models/Product");

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;
    const newProduct = new Product({ name, category, price, description, image });
    await newProduct.save();
    return res.status(201).json(newProduct);
  } catch (error) {
    return res.status(500).json({ error: "Failed to add product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });
    return res.json(updatedProduct);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};