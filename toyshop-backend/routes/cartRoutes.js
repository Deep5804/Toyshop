// const express = require("express");
// const router = express.Router();
// const Cart = require("../models/Cart");

// // Get cart by user ID
// router.get("/:userId", async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");
//     if (!cart) return res.status(404).json({ message: "Cart not found" });
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // Add item to cart
// router.post("/", async (req, res) => {
//     try {
//       const { userId, items } = req.body;
//       let cart = await Cart.findOne({ userId });
  
//       if (!cart) {
//         cart = new Cart({ userId, items });
//       } else {
//         items.forEach(({ productId, quantity }) => {
//           const itemIndex = cart.items.findIndex(
//             (item) => item.productId.toString() === productId
//           );
//           if (itemIndex > -1) {
//             cart.items[itemIndex].quantity += quantity;
//           } else {
//             cart.items.push({ productId, quantity });
//           }
//         });
//       }
  
//       await cart.save();
//       res.status(201).json(cart);
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   });
  
// // **Update item quantity in cart (PUT)**
// router.put("/:userId/:productId", async (req, res) => {
//     try {
//       const { userId, productId } = req.params;
//       const { quantity } = req.body;
  
//       if (quantity < 1) {
//         return res.status(400).json({ message: "Quantity must be at least 1" });
//       }
  
//       let cart = await Cart.findOne({ userId });
//       if (!cart) return res.status(404).json({ message: "Cart not found" });
  
//       const itemIndex = cart.items.findIndex(
//         (item) => item.productId.toString() === productId
//       );
  
//       if (itemIndex > -1) {
//         cart.items[itemIndex].quantity = quantity;
//         await cart.save();
//         res.json({ message: "Item quantity updated", cart });
//       } else {
//         res.status(404).json({ message: "Item not found in cart" });
//       }
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   });
  
// // Remove item from cart
// router.delete("/:userId/:productId", async (req, res) => {
//   try {
//     const { userId, productId } = req.params;
//     let cart = await Cart.findOne({ userId });
//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
//     await cart.save();
//     res.json({ message: "Item removed", cart });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // Clear cart
// router.delete("/:userId", async (req, res) => {
//   try {
//     await Cart.findOneAndDelete({ userId: req.params.userId });
//     res.json({ message: "Cart cleared" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = router;


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

// Update item quantity in cart
router.put("/:userId/:productId", async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.json({ message: "Item quantity updated", cart });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
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
