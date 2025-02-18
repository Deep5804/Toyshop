// const mongoose = require("mongoose");

// const OrderDetailSchema = new mongoose.Schema({
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   quantity: { type: Number, required: true },
//   price: { type: Number, required: true },
//   trackingId: { type: String, default: "" },
//   trackingPartner: { type: String, default: "" },
// },
// { collection: "OrderDetails" } // 👈 Force collection name to be "OrderDetails"
// );

// module.exports = mongoose.model("OrderDetail", OrderDetailSchema);


const mongoose = require("mongoose");

const OrderDetailSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
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
      price: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  trackingId: {
    type: String,
    default: null, // Optional: Set default to `null`
  },
  trackingPartner: {
    type: String,
    default: null, // Optional: Set default to `null`
  },
},
{ collection: "OrderDetails" } 
);

module.exports = mongoose.model("OrderDetail", OrderDetailSchema);
