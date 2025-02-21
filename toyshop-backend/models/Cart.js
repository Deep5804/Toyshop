
// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     items: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//         quantity: { type: Number, required: true, min: 1 },
//       },
//     ],
//   },
//   { collection: "Cart" } // 👈 Force collection name to be "Cart"
// );

// module.exports = mongoose.model("Cart", CartSchema);


const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 }, // Price of the product at the time of adding
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 }, // Total price of the cart
  },
  { collection: "Cart" }
);

// Middleware to calculate total price before saving the cart
CartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((total, item) => total + item.quantity * item.price, 0);
  next();
});

module.exports = mongoose.model("Cart", CartSchema);
