

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const Review = require("../models/Review");

// const router = express.Router();

// // Set up multer for multiple image uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Store images in 'uploads/' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname); // Unique filename
//   },
// });

// const upload = multer({ storage });

// // Create a new review (supports multiple images)
// router.post("/", upload.array("images", 5), async (req, res) => {
//   const { productId, userId, rating, comment } = req.body;
//   const images = req.files ? req.files.map((file) => file.filename) : []; // Store image filenames

//   try {
//     const existingReview = await Review.findOne({ productId, userId });

//     if (existingReview) {
//       return res.status(400).json({ message: "User has already reviewed this product" });
//     }

//     const newReview = new Review({ productId, userId, rating, comment, images });

//     await newReview.save();
//     res.status(201).json({ message: "Review added successfully", review: newReview });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to add review" });
//   }
// });
// //get all reviews
// router.get("/", async (req, res) => {
//   try {
//     const reviews = await Review.find()
//       .populate("userId", "name email")
//       .populate("productId", "name");
//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get all reviews" });
//   }
// });


// // Get reviews for a specific product
// router.get("/product/:productId", async (req, res) => {
//   const { productId } = req.params;

//   try {
//     const reviews = await Review.find({ productId }).populate("userId", "name email");
//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get reviews" });
//   }
// });

// // Get reviews by user
// router.get("/user/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const reviews = await Review.find({ userId }).populate("productId", "name description");
//     res.status(200).json(reviews);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to get reviews" });
//   }
// });

// // Update a review (supports updating images)
// router.put("/:reviewId", upload.array("images", 5), async (req, res) => {
//   const { reviewId } = req.params;
//   const { rating, comment } = req.body;
//   const images = req.files ? req.files.map((file) => file.filename) : undefined;

//   try {
//     const updateData = { rating, comment };
//     if (images) updateData.images = images;

//     const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
//     if (!updatedReview) {
//       return res.status(404).json({ message: "Review not found" });
//     }
//     res.status(200).json({ message: "Review updated successfully", review: updatedReview });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update review" });
//   }
// });

// // Delete a review
// router.delete("/:reviewId", async (req, res) => {
//   const { reviewId } = req.params;

//   try {
//     const deletedReview = await Review.findByIdAndDelete(reviewId);
//     if (!deletedReview) {
//       return res.status(404).json({ message: "Review not found" });
//     }
//     res.status(200).json({ message: "Review deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to delete review" });
//   }
// });

// router.put("/update-status/:id", async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["approved", "rejected"].includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status value." });
//     }

//     const review = await Review.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );

//     if (!review) {
//       return res.status(404).json({ success: false, message: "Review not found." });
//     }

//     res.json({ success: true, review });
//   } catch (err) {
//     console.error("Error updating review status:", err);
//     res.status(500).json({ success: false, message: "Server error." });
//   }
// });

// module.exports = router;


const express = require("express");
const Review = require("../models/Review");
const upload = require("../utils/upload"); // Use Cloudinary upload
const mongoose = require("mongoose");

const router = express.Router();

// Create a new review (supports multiple images via Cloudinary)
router.post("/", upload.array("images", 5), async (req, res) => {
  const { productId, userId, rating, comment } = req.body;
  const images = req.files ? req.files.map((file) => file.path) : []; // Store Cloudinary URLs

  try {
    // Validate required fields
    if (!productId || !userId || !rating || !comment) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({ message: "User has already reviewed this product" });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Create and save review
    const newReview = new Review({
      productId,
      userId,
      rating,
      comment,
      images, // Store Cloudinary URLs
      status: "pending",
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
});

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("productId", "name");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to get all reviews", error: error.message });
  }
});

// Get reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const reviews = await Review.find({ productId }).populate("userId", "name email");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    res.status(500).json({ message: "Failed to get reviews", error: error.message });
  }
});

// Get reviews by user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const reviews = await Review.find({ userId }).populate("productId", "name description");
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Failed to get reviews", error: error.message });
  }
});

// Update a review (supports updating images)
router.put("/:reviewId", upload.array("images", 5), async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const images = req.files ? req.files.map((file) => file.path) : undefined;

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid reviewId" });
    }

    const updateData = { rating, comment };
    if (images) updateData.images = images;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, { new: true });
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review", error: error.message });
  }
});

// Delete a review
router.delete("/:reviewId", async (req, res) => {
  const { reviewId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "Invalid reviewId" });
    }

    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
});

// Update review status
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid reviewId" });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, review });
  } catch (error) {
    console.error("Error updating review status:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;