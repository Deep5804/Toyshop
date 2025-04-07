const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ✅ Create a new category
// ✅ Create a new category (now supports subcategories)
router.post("/add", async (req, res) => {
  try {
    const { categoryID, categoryName, isRemoteControl, subcategories } = req.body;

    if (await Category.findOne({ categoryID })) {
      return res.status(400).json({ message: "Category ID already exists" });
    }
    if (await Category.findOne({ categoryName })) {
      return res.status(400).json({ message: "Category name already exists" });
    }

    const newCategory = new Category({
      categoryID,
      categoryName,
      isRemoteControl,
      subcategories: subcategories || []
    });

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

// Update a category
router.put("/update/:categoryID", async (req, res) => {
  try {
    const { categoryName, isRemoteControl } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { categoryID: req.params.categoryID },
      { categoryName, isRemoteControl },
      { new: true }
    );

    if (!updatedCategory) return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category updated successfully!", category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Error updating category", error });
  }
});
 
// Update a subcategory
router.put("/update-subcategory/:categoryID/:subcategoryID", async (req, res) => {
  try {
    const { subcategoryName } = req.body;

    const category = await Category.findOne({ categoryID: req.params.categoryID });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subcategory = category.subcategories.find(
      sub => sub.subcategoryID === req.params.subcategoryID
    );
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    // Update subcategory fields
    subcategory.subcategoryName = subcategoryName || subcategory.subcategoryName;

    await category.save();

    res.json({ message: "Subcategory updated successfully!", category });
  } catch (error) {
    res.status(500).json({ message: "Error updating subcategory", error });
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

// Delete a subcategory from a category
router.delete("/delete-subcategory/:categoryID/:subcategoryID", async (req, res) => {
  try {
    const { categoryID, subcategoryID } = req.params;

    const category = await Category.findOne({ categoryID });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const initialLength = category.subcategories.length;

    category.subcategories = category.subcategories.filter(
      sub => sub.subcategoryID !== subcategoryID
    );

    if (category.subcategories.length === initialLength) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await category.save();

    res.json({ message: "Subcategory deleted successfully!", category });
  } catch (error) {
    res.status(500).json({ message: "Error deleting subcategory", error });
  }
});

module.exports = router;
