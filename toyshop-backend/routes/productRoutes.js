const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Create a new product
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, materialType, productType } = req.body;

    // Check if product with the same name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // Ensure at least two product types are selected
    if (!Array.isArray(productType) || productType.length < 2) {
      return res.status(400).json({ message: "At least two product types must be selected." });
    }

    const newProduct = new Product({ name, description, price, stock, categoryId, materialType, productType });
    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const { productType } = req.body;

    // Ensure at least two product types are selected if updating productType
    if (productType && (!Array.isArray(productType) || productType.length < 2)) {
      return res.status(400).json({ message: "At least two product types must be selected." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export the router
module.exports = router;
