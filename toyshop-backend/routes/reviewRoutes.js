const express = require("express");
const Review = require("../models/Review");
const router = express.Router();

// Create a new review
router.post("/", async (req, res) => {
  const { productId, userId, rating, comment } = req.body;

  try {
    const newReview = new Review({
      productId,
      userId,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add review" });
  }
});

// Get reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId }).populate("userId", "name email"); // Populate user details
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get reviews" });
  }
});

// Get reviews by user
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.find({ userId }).populate("productId", "name description"); // Populate product details
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get reviews" });
  }
});

// Update a review
router.put("/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { rating, comment },
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update review" });
  }
});

// Delete a review
router.delete("/:reviewId", async (req, res) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

module.exports = router;
