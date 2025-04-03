const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ✅ Create a new category
router.post("/add", async (req, res) => {
  try {
    const { categoryID, categoryName, isRemoteControl } = req.body;

    // Check if category ID or name already exists
    if (await Category.findOne({ categoryID })) {
      return res.status(400).json({ message: "Category ID already exists" });
    }
    if (await Category.findOne({ categoryName })) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const newCategory = new Category({ categoryID, categoryName, isRemoteControl, subcategories: [] });
    await newCategory.save();

    res.status(201).json({ message: "Category added successfully!", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
});

// ✅ Add a subcategory to a category
router.post("/add-subcategory/:categoryID", async (req, res) => {
  try {
    const { subcategoryID, subcategoryName } = req.body;
    const category = await Category.findOne({ categoryID: req.params.categoryID });

    if (!category) return res.status(404).json({ message: "Category not found" });

    // Check if subcategory already exists
    if (category.subcategories.some(sub => sub.subcategoryID === subcategoryID)) {
      return res.status(400).json({ message: "Subcategory ID already exists" });
    }

    category.subcategories.push({ subcategoryID, subcategoryName, products: [] });
    await category.save();

    res.status(201).json({ message: "Subcategory added successfully!", category });
  } catch (error) {
    res.status(500).json({ message: "Error adding subcategory", error });
  }
});

// ✅ Get all categories with subcategories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// ✅ Get a specific category with subcategories
router.get("/:categoryID", async (req, res) => {
  try {
    const category = await Category.findOne({ categoryID: req.params.categoryID });
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
});

// ✅ Delete a category (and its subcategories)
router.delete("/delete/:categoryID", async (req, res) => {
  try {
    const deletedCategory = await Category.findOneAndDelete({ categoryID: req.params.categoryID });
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
});

module.exports = router;
