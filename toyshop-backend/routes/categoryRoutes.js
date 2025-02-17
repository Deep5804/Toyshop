const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ✅ Create a new category
router.post("/add", async (req, res) => {
  try {
    const { categoryName } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({ categoryName });
    await newCategory.save();

    res.status(201).json({ message: "Category added successfully!", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error adding category", error });
  }
});

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
});

// ✅ Get a category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
});

// ✅ Update a category
router.put("/update/:id", async (req, res) => {
  try {
    const { categoryName } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryName },
      { new: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated successfully!", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
});

// ✅ Delete a category
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
});

module.exports = router;
