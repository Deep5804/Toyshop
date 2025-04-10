const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: { type: [String], default: [] }, // Allow multiple images
  },
  {
    collection: "Reviews", // Force collection name to be "Reviews"
    timestamps: true       // ✅ This enables createdAt and updatedAt
  }
);

module.exports = mongoose.model("Review", ReviewSchema);
