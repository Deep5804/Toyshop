// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   totalAmount: { type: Number, required: true },
//   orderStatus: { type: String, default: "Pending" }, // "Pending", "Shipped", "Delivered"
//   orderDate: { type: Date, default: Date.now },
// },
// { collection: "Orders" } // 👈 Force collection name to be "Orders"
// );

// module.exports = mongoose.model("Order", OrderSchema);


const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, default: "Pending" },
  orderDate: { type: Date, default: Date.now },
}, { collection: "Orders" });

module.exports = mongoose.model("Order", OrderSchema);
