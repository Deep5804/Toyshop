// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");

// // Create a new order
// router.post("/", async (req, res) => {
//   try {
//     const { userId, totalAmount, orderStatus } = req.body;
//     const newOrder = new Order({ userId, totalAmount, orderStatus });
//     await newOrder.save();
//     res.status(201).json({ message: "Order successfully created", order: newOrder });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating order", error });
//   }
// });

// // Get all orders
// router.get("/", async (req, res) => {
//   try {
//     const orders = await Order.find().populate("userId", "name email");
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching orders", error });
//   }
// });

// // Get order by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id).populate("userId", "name email");
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching order", error });
//   }
// });

// // Update order status
// router.put("/:id", async (req, res) => {
//   try {
//     const { orderStatus } = req.body;
//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       { orderStatus },
//       { new: true }
//     );
//     if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json({ message: "Order successfully updated", order: updatedOrder });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating order", error });
//   }
// });

// // Delete an order
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//     if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json({ message: "Order successfully deleted" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting order", error });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// 🔹 Create a new order
router.post("/", async (req, res) => {
  try {
    const { userId, products } = req.body;

    if (!userId || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "User ID and products array are required" });
    }

    const productIds = products.map(p => p.productId);
    const productDocs = await Product.find({ _id: { $in: productIds } });

    if (productDocs.length !== products.length) {
      return res.status(400).json({ message: "One or more products are invalid" });
    }

    let totalAmount = 0;
    const finalProducts = products.map(item => {
      const product = productDocs.find(p => p._id.toString() === item.productId);
      const productPrice = product.price;
      totalAmount += productPrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    const newOrder = new Order({
      userId,
      products: finalProducts,
      totalAmount,
    });

    await newOrder.save();
    res.status(201).json({ message: "Order successfully created", order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: "Error creating order", error });
  }
});

// 🔹 Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// 🔹 Get order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("products.productId", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
});

// 🔹 Update order (e.g., change products or quantities)
router.put("/:id", async (req, res) => {
  try {
    const { products, orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    let updatedProducts = order.products;
    let totalAmount = order.totalAmount;

    if (products && Array.isArray(products)) {
      const productIds = products.map(p => p.productId);
      const productDocs = await Product.find({ _id: { $in: productIds } });

      if (productDocs.length !== products.length) {
        return res.status(400).json({ message: "Some products are invalid" });
      }

      totalAmount = 0;
      updatedProducts = products.map(item => {
        const product = productDocs.find(p => p._id.toString() === item.productId);
        totalAmount += product.price * item.quantity;
        return {
          productId: item.productId,
          quantity: item.quantity,
        };
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        ...(products ? { products: updatedProducts } : {}),
        ...(orderStatus ? { orderStatus } : {}),
        totalAmount,
      },
      { new: true }
    );

    res.status(200).json({ message: "Order updated", order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
});

// 🔹 Delete an order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
});


module.exports = router;

