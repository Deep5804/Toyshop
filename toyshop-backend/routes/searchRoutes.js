const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Search products by name, description, materialType, or productType
router.get("/", async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Case-insensitive search across multiple fields
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { materialType: { $regex: query, $options: "i" } },
        { productType: { $regex: query, $options: "i" } },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;