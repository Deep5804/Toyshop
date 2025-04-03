
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    materialType: { type: String, required: true }, 
    productType: { type: [String], required: true }, 
    imageUrls: { type: [String], required: true }
  },
  { collection: "Products" }
);

module.exports = mongoose.model("Product", ProductSchema);
