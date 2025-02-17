const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, totalAmount, orderStatus } = req.body;
    const newOrder = new Order({ userId, totalAmount, orderStatus });
    await newOrder.save();
    res.status(201).json({ message: "Order successfully created", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
});

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("userId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// Update order status
router.put("/:id", async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order successfully updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
});

// Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});

module.exports = router;
