const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const User = require("../models/User");
const Order = require("../models/Order");

// Create a new payment
router.post("/", async (req, res) => {
  try {
    const { userId, orderId, transactionId, paymentMethod, paymentStatus } = req.body;
    
    // Validate user exists
    const userExists = await User.findById(userId);
    if (!userExists) return res.status(400).json({ message: "User not found" });

    // Validate order exists
    const orderExists = await Order.findById(orderId);
    if (!orderExists) return res.status(400).json({ message: "Order not found" });

    const newPayment = new Payment({
      userId,
      orderId,
      transactionId,
      paymentMethod,
      paymentStatus,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
});

// Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().populate("userId orderId");
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments", error });
  }
});

// Get a payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("userId orderId");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
});

// Update a payment by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: "Error updating payment", error });
  }
});

// Delete a payment by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
});

module.exports = router;