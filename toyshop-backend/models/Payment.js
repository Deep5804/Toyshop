const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true }, // Reference to Order
    transactionId: { type: String, default: "" }, // If exists, store; otherwise, default to empty string
    paymentMethod: { type: String, required: true }, // e.g., "Credit Card", "PayPal", "Cash on Delivery"
    paymentDate: { type: Date, default: Date.now },
    paymentStatus: { type: String, default: "Pending" }, // "Pending", "Completed", "Failed"
  },
  { collection: "Payments" } // 👈 Force collection name to be "Payments"
);

module.exports = mongoose.model("Payment", PaymentSchema);
