// const express = require("express");
// const OrderDetail = require("../modules/OrderDetail");

// const router = express.Router();

// // ✅ Create a new Order Detail (Adding product to an order)
// router.post("/", async (req, res) => {
//   try {
//     const { orderId, productId, quantity, price } = req.body;

//     if (!orderId || !productId || !quantity || !price) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const newOrderDetail = new OrderDetail({ orderId, productId, quantity, price });
//     await newOrderDetail.save();

//     res.status(201).json(newOrderDetail);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // ✅ Get all Order Details
// router.get("/", async (req, res) => {
//   try {
//     const orderDetails = await OrderDetail.find().populate("orderId productId");
//     res.status(200).json(orderDetails);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // ✅ Get Order Details by Order ID (All products in an order)
// router.get("/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const orderDetails = await OrderDetail.find({ orderId }).populate("productId");

//     if (!orderDetails.length) {
//       return res.status(404).json({ message: "No order details found for this order" });
//     }

//     res.status(200).json(orderDetails);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // ✅ Update Tracking Info for an Order Detail
// router.put("/:id/tracking", async (req, res) => {
//   try {
//     const { trackingId, trackingPartner } = req.body;
//     const updatedOrderDetail = await OrderDetail.findByIdAndUpdate(
//       req.params.id,
//       { trackingId, trackingPartner },
//       { new: true }
//     );

//     if (!updatedOrderDetail) {
//       return res.status(404).json({ message: "Order Detail not found" });
//     }

//     res.status(200).json(updatedOrderDetail);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// // ✅ Delete an Order Detail (Remove product from an order)
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedOrderDetail = await OrderDetail.findByIdAndDelete(req.params.id);

//     if (!deletedOrderDetail) {
//       return res.status(404).json({ message: "Order Detail not found" });
//     }

//     res.status(200).json({ message: "Order Detail deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// });

// module.exports = router;


const express = require("express");
const Order = require("../models/Order");  // ✅ Ensure this line is present
const Product = require("../models/Product");
const OrderDetail = require("../models/OrderDetail");


const router = express.Router();

/**
 * ✅ Create Order Details (Add multiple products to an order)
 * Request Body Example:
 * {
 *   "orderId": "65d123abc...",
 *   "products": [
 *     { "productId": "65d456def...", "quantity": 2, "price": 500 },
 *     { "productId": "65d789ghi...", "quantity": 1, "price": 300 }
 *   ]
 * }
 */
// ✅ Create Order Details (Add multiple products to an order)
// router.post("/", async (req, res) => {
//     try {
//       const { orderId, products, trackingId, trackingPartner } = req.body;
  
//       // Validation
//       if (!orderId || !Array.isArray(products) || products.length === 0) {
//         return res.status(400).json({ message: "OrderId and products array are required" });
//       }
  
//       // Check if orderId and productId exist in the database
//       const order = await Order.findById(orderId);
//       if (!order) {
//         return res.status(404).json({ message: "Invalid Order ID" });
//       }
  
//       const productIds = products.map(product => product.productId);
//       const productsExist = await Product.find({ '_id': { $in: productIds } });
//       if (productsExist.length !== products.length) {
//         return res.status(404).json({ message: "Some products are invalid" });
//       }
  
//       // Create the new order details with tracking info
//       const newOrderDetail = new OrderDetail({
//         orderId,
//         products,
//         trackingId: trackingId || "", // If trackingId is provided, use it; otherwise, default to ""
//         trackingPartner: trackingPartner || "", // Same for trackingPartner
//       });
  
//       // Save the new order detail
//       const savedOrderDetail = await newOrderDetail.save();
  
//       res.status(201).json(savedOrderDetail);
//     } catch (error) {
//       res.status(500).json({ message: "Server error", error });
//     }
//   });
  




router.post("/", async (req, res) => {
    try {
      const { orderId, products, trackingId, trackingPartner } = req.body;
  
      console.log("Request Body:", req.body);  // Log the request body
  
      // Validation
      if (!orderId || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: "OrderId and products array are required" });
      }
  
      // Check if orderId and productId exist in the database
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Invalid Order ID" });
      }
  
      const productIds = products.map(product => product.productId);
      const productsExist = await Product.find({ '_id': { $in: productIds } });
      if (productsExist.length !== products.length) {
        return res.status(404).json({ message: "Some products are invalid" });
      }
  
      // Create the new order details with tracking info
      const newOrderDetail = new OrderDetail({
        orderId,
        products,
        trackingId: trackingId , // If trackingId is provided, use it; otherwise, default to ""
        trackingPartner: trackingPartner , // Same for trackingPartner
      });
  
      // Save the new order detail
      const savedOrderDetail = await newOrderDetail.save();
  
      res.status(201).json(savedOrderDetail);
    } catch (error) {
      console.error("Error in POST request:", error);
      res.status(500).json({ message: "Server error", error });
    }
  });
  

/**
 * ✅ Get all Order Details
 * Fetches all order details including product information
 */
router.get("/", async (req, res) => {
  try {
    const orderDetails = await OrderDetail.find().populate("orderId products.productId");
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * ✅ Get Order Details by Order ID (Fetch all products in an order)
 * URL: /api/order-details/:orderId
 */
router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const orderDetails = await OrderDetail.findOne({ orderId }).populate("products.productId");

    if (!orderDetails) {
      return res.status(404).json({ message: "No order details found for this order" });
    }

    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * ✅ Update Tracking Info for an Order
 * Request Body Example:
 * {
 *   "trackingId": "TRACK123456",
 *   "trackingPartner": "FedEx"
 * }
 */
router.put("/:orderId/tracking", async (req, res) => {
  try {
    const { trackingId, trackingPartner } = req.body;

    const updatedOrderDetail = await OrderDetail.findOneAndUpdate(
      { orderId: req.params.orderId },
      { trackingId, trackingPartner },
      { new: true }
    );

    if (!updatedOrderDetail) {
      return res.status(404).json({ message: "Order Detail not found" });
    }

    res.status(200).json(updatedOrderDetail);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * ✅ Update Order Details (Modify product quantities/prices)
 * Request Body Example:
 * {
 *   "products": [
 *     { "productId": "65d456def...", "quantity": 3, "price": 600 }
 *   ]
 * }
 */
router.put("/:orderId", async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    const updatedOrderDetail = await OrderDetail.findOneAndUpdate(
      { orderId: req.params.orderId },
      { products },
      { new: true }
    );

    if (!updatedOrderDetail) {
      return res.status(404).json({ message: "Order Detail not found" });
    }

    res.status(200).json(updatedOrderDetail);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * ✅ Delete an Order Detail (Remove all products in an order)
 * URL: /api/order-details/:orderId
 */
router.delete("/:orderId", async (req, res) => {
  try {
    const deletedOrderDetail = await OrderDetail.findOneAndDelete({ orderId: req.params.orderId });

    if (!deletedOrderDetail) {
      return res.status(404).json({ message: "Order Detail not found" });
    }

    res.status(200).json({ message: "Order Detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

/**
 * ✅ Delete a specific product from an order (instead of removing the whole order)
 * URL: /api/order-details/:orderId/remove-product/:productId
 */
router.delete("/:orderId/remove-product/:productId", async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const updatedOrderDetail = await OrderDetail.findOneAndUpdate(
      { orderId },
      { $pull: { products: { productId } } },
      { new: true }
    );

    if (!updatedOrderDetail) {
      return res.status(404).json({ message: "Order Detail or Product not found" });
    }

    res.status(200).json({ message: "Product removed from order", updatedOrderDetail });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
