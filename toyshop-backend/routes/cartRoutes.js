const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Get cart by user ID
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add item to cart
router.post("/", async (req, res) => {
  try {
    const { userId, items } = req.body;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items });
    } else {
      items.forEach(({ productId, quantity, price }) => {
        const itemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId
        );

        if (itemIndex > -1) {
          cart.items[itemIndex].quantity += quantity;
          cart.items[itemIndex].price = price; // Update price in case it has changed
        } else {
          cart.items.push({ productId, quantity, price });
        }
      });
    }

    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update cart by user ID (replaces all items)
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { items } = req.body;

    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items array is required and cannot be empty" });
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1 || !item.price) {
        return res.status(400).json({ message: "Each item must have a valid productId, quantity (at least 1), and price" });
      }
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      // Create new cart if none exists
      cart = new Cart({ userId, items });
    } else {
      // Replace all existing items with new items
      cart.items = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));
    }

    await cart.save();
    // Populate product details in the response
    const updatedCart = await Cart.findOne({ userId }).populate("items.productId");
    res.json({ message: "Cart updated successfully", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Remove item from cart
router.delete("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Clear cart
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;