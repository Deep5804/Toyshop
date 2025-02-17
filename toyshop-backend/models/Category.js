const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true, unique: true },
},
{ collection: "Categories" } // 👈 Force collection name to be "Categories"

);

module.exports = mongoose.model("Category", CategorySchema);
