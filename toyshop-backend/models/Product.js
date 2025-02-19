const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Name must be unique
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    materialType: { type: String, required: true, enum: ["Metal", "Wooden", "Plastic", "Glass", "Other"] }, // New field for material type
    productType: { type: [String], required: true, enum: ["School", "Office", "Bike", "Car", "Home", "Outdoor", "Other"] } // New field for multiple product types
  },
  { collection: "Products" } // Ensures data is stored in "Products"
);

module.exports = mongoose.model("Product", ProductSchema);