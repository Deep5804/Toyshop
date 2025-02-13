const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }
  },
  { collection: "Products" } // 👈 Ensures data is stored in "Products"
);

module.exports = mongoose.model("Product", ProductSchema);
