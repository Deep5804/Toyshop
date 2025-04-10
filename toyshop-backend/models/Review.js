// const mongoose = require("mongoose");

// const ReviewSchema = new mongoose.Schema(
//   {
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String, required: true },
//     images: { type: [String], default: [] }, // Allow multiple images
//   },
//   {
//     collection: "Reviews", // Force collection name to be "Reviews"
//     timestamps: true       // ✅ This enables createdAt and updatedAt
//   }
// );

// module.exports = mongoose.model("Review", ReviewSchema);
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // must match the name of your Product model
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // must match the name of your User model
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { collection: "Reviews",
    timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
