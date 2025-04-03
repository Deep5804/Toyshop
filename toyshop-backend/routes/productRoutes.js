const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const upload = require("../utils/upload");
const mongoose = require("mongoose");
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
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all products in a specific subcategory
router.get("/subcategory/:subcategoryID", async (req, res) => {
  try {
    const category = await Category.findOne({ "subcategories.subcategoryID": req.params.subcategoryID })
      .populate("subcategories.products");

    if (!category) return res.status(404).json({ message: "Subcategory not found" });

    const subcategory = category.subcategories.find(sub => sub.subcategoryID === req.params.subcategoryID);
    res.status(200).json(subcategory.products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new product (assign to subcategory)
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, stock, materialType, productType, categoryID, subcategoryID } = req.body;

    // ✅ Find category and subcategory
    const category = await Category.findOne({ categoryID });
    if (!category) return res.status(400).json({ message: "Category not found." });

    const subcategory = category.subcategories.find(sub => sub.subcategoryID === subcategoryID);
    if (!subcategory) return res.status(400).json({ message: "Subcategory not found." });

    // ✅ Create product
    const imageUrls = req.files.map(file => file.path);
    const newProduct = new Product({ name, description, price, stock, materialType, productType, imageUrls });

    await newProduct.save();

    // ✅ Assign product to subcategory
    subcategory.products.push(newProduct._id);
    await category.save();

    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { categoryID, subcategoryID, ...updateFields } = req.body; // Extract categoryID, subcategoryID separately

    // ✅ Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    // ✅ Validate category and subcategory only if provided
    if (categoryID && subcategoryID) {
      const category = await Category.findOne({ categoryID });
      if (!category) return res.status(400).json({ message: "Category not found." });

      const subcategory = category.subcategories?.find(sub => sub.subcategoryID === subcategoryID);
      if (!subcategory) return res.status(400).json({ message: "Subcategory not found." });
    }

    // ✅ Handle image update only if new images are uploaded
    if (req.files && req.files.length > 0) {
      updateFields.imageUrls = req.files.map(file => file.path);
    }

    // ✅ Update product with only the given fields
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields }, // Update only provided fields
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("Update Product Error:", err); // Log error for debugging
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
});
 
// ✅ Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
