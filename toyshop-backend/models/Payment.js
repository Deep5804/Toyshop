const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  paymentMethod: { type: String, required: true }, // e.g., "Credit Card", "PayPal"
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: { type: String, default: "Pending" }, // "Pending", "Completed", "Failed"
});

module.exports = mongoose.model("Payment", PaymentSchema);
