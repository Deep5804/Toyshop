const express = require("express");
const Newsletter = require("../models/Newsletter");

const router = express.Router();

// ✅ POST - Subscribe to Newsletter
router.post("/", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email ID is required." });
    }

    // Check if the email is already subscribed
    const existingSubscription = await Newsletter.findOne({ emailId });

    if (existingSubscription) {
      return res.status(400).json({ message: "You are already subscribed!" });
    }

    // Save new subscription
    const newSubscriber = new Newsletter({ emailId });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscription successful!", subscriber: newSubscriber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET - Get all subscribed emails (Admin use)
router.get("/", async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    if (subscribers.length === 0) {
      return res.status(404).json({ message: "No subscribers found." });
    }

    res.status(200).json({ success: true, subscribers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE - Unsubscribe using Email ID
router.delete("/", async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({ message: "Email ID is required for unsubscription." });
    }

    const deletedSubscriber = await Newsletter.findOneAndDelete({ emailId });

    if (!deletedSubscriber) {
      return res.status(404).json({ message: "Email not found in subscriptions." });
    }

    res.status(200).json({ message: "Unsubscribed successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
