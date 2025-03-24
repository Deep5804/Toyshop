const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoryID: { type: String, required: true }, // Manually added categoryID
    materialType: { type: String, required: true }, // Example: "Metal", "Wooden"
    productType: { type: [String], required: true }, // Example: ["School", "Office"]
    imageUrls: { type: [String], required: true } // Multiple Cloudinary images stored as URLs
  },
  { collection: "Products" }
);

module.exports = mongoose.model("Product", ProductSchema);
