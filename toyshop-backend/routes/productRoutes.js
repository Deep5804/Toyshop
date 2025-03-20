const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");

const router = express.Router();

// ✅ Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a product by ID
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

// ✅ Create a new product (Only if categoryID exists)
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, categoryID, materialType, productType, imageUrls } = req.body;

    // ✅ Check if product with the same name already exists
    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "Product already exists" });
    }

    // ✅ Check if the provided categoryID exists in Categories collection
    const categoryExists = await Category.findOne({ categoryID });
    if (!categoryExists) {
      return res.status(400).json({ message: "Category does not exist. Please provide a valid categoryID." });
    }

    // ✅ Ensure at least two product types are selected
    if (!Array.isArray(productType) || productType.length < 2) {
      return res.status(400).json({ message: "At least two product types must be selected." });
    }

    // ✅ Ensure at least one image URL is provided
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res.status(400).json({ message: "At least one image URL must be provided." });
    }

    // ✅ Create and save the new product
    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      categoryID,
      materialType,
      productType,
      imageUrls
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const { categoryID, productType, imageUrls } = req.body;

    // ✅ Check if categoryID exists if provided
    if (categoryID) {
      const categoryExists = await Category.findOne({ categoryID });
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist. Please provide a valid categoryID." });
      }
    }

    // ✅ Ensure at least two product types are selected if updating productType
    if (productType && (!Array.isArray(productType) || productType.length < 2)) {
      return res.status(400).json({ message: "At least two product types must be selected." });
    }

    // ✅ Ensure at least one image URL is provided if updating imageUrls
    if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.length === 0)) {
      return res.status(400).json({ message: "At least one image URL must be provided." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a product by ID
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

module.exports = router;
