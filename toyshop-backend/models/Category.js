// const mongoose = require("mongoose");

// const CategorySchema = new mongoose.Schema(
//   {
//     categoryName: { type: String, required: true, unique: true },
//     isRemoteControl: { type: Boolean, required: true }, // Added isRemoteControl field
//   },
//   { collection: "Categories" } // 👈 Force collection name to be "Categories"
// );

// module.exports = mongoose.model("Category", CategorySchema);

const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    categoryID: { type: String, required: true, unique: true }, // ✅ Added categoryID
    categoryName: { type: String, required: true, unique: true },
    isRemoteControl: { type: Boolean, required: true }
  },
  { collection: "Categories" }
);

module.exports = mongoose.model("Category", CategorySchema);
