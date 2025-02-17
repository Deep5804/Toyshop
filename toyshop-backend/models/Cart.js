// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//   quantity: { type: Number, required: true, min: 1 },
// },
// { collection: "Cart" }  // 👈 Force collection name to be "Cart"
// )
// ;

// module.exports = mongoose.model("Cart", CartSchema);



const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
  },
  { collection: "Cart" } // 👈 Force collection name to be "Cart"
);

module.exports = mongoose.model("Cart", CartSchema);

