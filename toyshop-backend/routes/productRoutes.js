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


router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    console.log(req.body);
    let { name, description, price, stock, materialType, productType, categoryID, subcategoryID } = req.body;

    // ✅ Convert categoryID and subcategoryID to arrays if they are strings
    let categoryIDs = Array.isArray(categoryID) ? categoryID : [categoryID];
    let subcategoryIDs = Array.isArray(subcategoryID) ? subcategoryID : [subcategoryID];

    console.log(categoryIDs);
    console.log(subcategoryIDs);

    if (!Array.isArray(categoryIDs) || !Array.isArray(subcategoryIDs)) {
      return res.status(400).json({ message: "must be arrays." });
    }

    // ✅ Create product
    const imageUrls = req.files.map(file => file.path);
    const newProduct = new Product({ name, description, price, stock, materialType, productType, imageUrls });

    await newProduct.save();

    // ✅ Assign product to multiple categories and subcategories
    for (const categoryID of categoryIDs) {
      const category = await Category.findOne({ categoryID });
      if (!category) continue; // Skip if category not found

      for (const subcategoryID of subcategoryIDs) {
        const subcategory = category.subcategories.find(sub => sub.subcategoryID === subcategoryID);
        if (subcategory) {
          subcategory.products.push(newProduct._id);
        }
      }
      await category.save();
    }

    res.status(201).json({ message: "Product added to multiple categories and subcategories successfully!", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { categoryID, subcategoryID, ...updateFields } = req.body;
    const productId = req.params.id;

    // ✅ Validate Product ID
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    // ✅ Normalize categoryID and subcategoryID into arrays if provided
    const categoryIDs = categoryID
      ? Array.isArray(categoryID) ? categoryID : [categoryID]
      : null;

    const subcategoryIDs = subcategoryID
      ? Array.isArray(subcategoryID) ? subcategoryID : [subcategoryID]
      : null;

    // ✅ Handle image update if any
    if (req.files && req.files.length > 0) {
      updateFields.imageUrls = req.files.map(file => file.path);
    }

    // ✅ Update basic product fields
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ If category and subcategory IDs are provided, update category assignments
    if (categoryIDs && subcategoryIDs) {
      // Remove product from all previous categories/subcategories
      await Category.updateMany(
        { "subcategories.products": productId },
        { $pull: { "subcategories.$[].products": productId } }
      );

      // Add product to new categories/subcategories
      for (const catID of categoryIDs) {
        const category = await Category.findOne({ categoryID: catID });
        if (!category) continue;

        for (const subID of subcategoryIDs) {
          const subcategory = category.subcategories.find(sub => sub.subcategoryID === subID);
          if (subcategory && !subcategory.products.includes(productId)) {
            subcategory.products.push(productId);
          }
        }

        await category.save();
      }
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

  } catch (err) {
    console.error("Update Product Error:", err);
    res.status(500).json({ message: "Error updating product", error: err.message });
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
// Search endpoint with prioritized fields
router.get("/search/search", async (req, res) => {
  try {
    console.log("Hit /search/search with query:", req.query);
    const { name, page = 1, limit = 10 } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Query parameter 'name' is required" });
    }

    const keywords = name.trim().split(/\s+/); // Split into individual keywords
    const regexQueries = keywords.map(keyword => ({
      $regex: keyword,
      $options: "i" // Case-insensitive
    }));

    // Create queries for each field
    const nameQuery = { name: { $in: regexQueries } };
    const descriptionQuery = { description: { $in: regexQueries } };
    const materialTypeQuery = { materialType: { $in: regexQueries } };

    // Aggregate to prioritize name > description > materialType
    const products = await Product.aggregate([
      {
        $addFields: {
          // Assign priority scores based on field matches
          priority: {
            $cond: {
              if: { $in: ["$name", regexQueries.map(q => q.$regex)] },
              then: 3, // Highest priority for name
              else: {
                $cond: {
                  if: { $in: ["$description", regexQueries.map(q => q.$regex)] },
                  then: 2, // Medium priority for description
                  else: {
                    $cond: {
                      if: { $in: ["$materialType", regexQueries.map(q => q.$regex)] },
                      then: 1, // Lowest priority for materialType
                      else: 0
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $match: {
          $or: [
            nameQuery,
            descriptionQuery,
            materialTypeQuery
          ],
          priority: { $gt: 0 } // Only include matches
        }
      },
      { $sort: { priority: -1, name: 1 } }, // Sort by priority (desc), then name
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
      {
        $project: {
          priority: 0 // Exclude priority field from response
        }
      }
    ]);

    // Count total matching documents
    const total = await Product.countDocuments({
      $or: [
        nameQuery,
        descriptionQuery,
        materialTypeQuery
      ]
    });

    res.status(200).json({
      products,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit) || 1,
    });
  } catch (err) {
    console.error("Error in /search/search:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
